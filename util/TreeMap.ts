import { CompareFn, assertIsDefined } from './helper';

class Node<K, V> {
  public static get BLACK(): boolean { return false; }
  public static get RED(): boolean { return true; }

  public key: K;
  public value: V;
  public size: number; // number of entries in this subtree
  public color: boolean; // color of link from parent to this node
  public left?: Node<K, V>;
  public right?: Node<K, V>;

  constructor(key: K, value: V, size: number, color: boolean) {
    this.key = key;
    this.value = value;
    this.size = size;
    this.color = color;
  }

  get entry(): [K, V] {
    return [this.key, this.value];
  }
}

/**
 * An ordered symbol table implemented using a left-leaning red-black BST.
 * 
 * This implementation provides O(log(n)) time cost for `has`, `get`, `set`, `delete`, `deleteMin`,
 * `deleteMax` methods and order based queries(floor, ceil, select and rank). Algorithms are based
 * on those in Robert Sedgewick and Kevin Wayne’s Algorithms 4th edition.
 */
export class TreeMap<K, V> implements Map<K, V> {
  private root?: Node<K, V>;
  private compareFn?: CompareFn<K>;

  /**
   * @param compareFn Function used to determine the order of the keys. It is expected to return a
   * negative value if first argument is less than second argument, zero if they're equal and a
   * positive value otherwise. If omitted, the keys are compared in ASCII character order.
   * ```ts
   * const map = new TreeMap<number, number>((a, b) => a - b);
   * ```
   */
  constructor(compareFn?: CompareFn<K>) {
    this.compareFn = compareFn;
  }

  /**
   * Returns the number of key-value pairs in this map.
   */
  get size(): number {
    return this._size(this.root);
  }

  /**
   * Does this map contain `key`?
   * @param key
   */
  has(key: K): boolean {
    return this._get(this.root, key) ? true : false;
  }

  /**
   * Returns the value associated with `key`. Or `undefined` if this map does not contain the given
   * key. A return value of `undefined` does not necessarily indicate that this map does not contain
   * the key. It's also possible that the map explicitly maps the key to `undefined`. The `has`
   * operation may be used to distinguish these two cases.
   * @param key
   * @return the value associated with the given key, or `undefined` if the key is not in the map
   */
  get(key: K): V | undefined {
    return this._get(this.root, key)?.value;
  }

  /**
   * Inserts the specified key-value pair, overwriting the old value with the new value if the
   * map already contains the specified key.
   * @param key
   * @param value
   */
  set(key: K, value: V): this {
    this.root = this._set(this.root, key, value);
    this.root.color = Node.BLACK;
    return this;
  }

  /**
   * Deletes the smallest key and it's associated value.
   * @returns `true` if the smallest key has been removed, or `false` if the map is empty
   */
  deleteMin(): boolean {
    if (!this.root) return false;

    if (!this.isRed(this.root.left) && !this.isRed(this.root.right)) {
      this.root.color = Node.RED;
    }
    this.root = this._deleteMin(this.root);
    if (this.root) this.root.color = Node.BLACK;
    return true;
  }

  /**
   * Deletes the largest key and it's associated value.
   * @returns `true` if the largest key has been removed, or `false` if the map is empty
   */
  deleteMax(): boolean {
    if (!this.root) return false;

    if (!this.isRed(this.root.left) && !this.isRed(this.root.right)) {
      this.root.color = Node.RED;
    }
    this.root = this._deleteMax(this.root);
    if (this.root) this.root.color = Node.BLACK;
    return true;
  }

  /**
   * Deletes `key` and it's associated value.
   * @param key
   * @returns `true` if the key existed and has been removed, or `false` if the key does not exist
   */
  delete(key: K): boolean {
    if (!this.root) return false;
    if (!this.has(key)) return false;

    if (!this.isRed(this.root.left) && !this.isRed(this.root.right)) {
      this.root.color = Node.RED;
    }
    this.root = this._delete(this.root, key);
    if (this.root) this.root.color = Node.BLACK;
    return true;
  }

  /**
   * Deletes all key-value pairs from this map. 
   */
  clear(): void {
    delete this.root;
  }

  /**
   * Returns the key-value pair with the smallest key.
   */
  get min(): [K, V] | undefined {
    return this._min(this.root)?.entry;
  }

  /**
   * Returns the key-value pair with the largest key.
   */
  get max(): [K, V] | undefined {
    return this._max(this.root)?.entry;
  }

  /**
   * Returns the key-value pair with the largest key less than or equal to `key`.
   * @param key
   */
  floor(key: K): [K, V] | undefined {
    return this._floor(this.root, key)?.entry;
  }

  /**
   * Returns the key-value pair with the smallest key greater than or equal to `key`.
   * @param key
   */
  ceil(key: K): [K, V] | undefined {
    return this._ceil(this.root, key)?.entry;
  }

  /**
   * Return the key-value pair of a given `rank`.
   * @param rank
   */
  select(rank: number): [K, V] | undefined {
    return this._select(this.root, rank)?.entry;
  }

  /**
   * Return the number of keys less than `key`.
   * @param key
   */
  rank(key: K): number {
    return this._rank(this.root, key);
  }

  /**
   * Calls `callbackFn` once for each key-value pair in order.
   * @param {CallbackFn} callbackFn
   * @param thisArg the `this` value for each invocation of `callbackFn`
   */
  forEach(callbackFn: (value: V, key: K, map: TreeMap<K, V>) => void, thisArg?: any): void {
    for (const [k, v] of this) {
      callbackFn.call(thisArg, v, k, this);
    }
  }

  /**
   * Returns a new `Iterator` object that contains the key-value pairs in order.
   */
  *[Symbol.iterator](): IterableIterator<[K, V]> {
    const stack: Node<K, V>[] = [];
    let x = this.root;

    while (x || stack.length > 0) {
      while (x) {
        stack.push(x);
        x = x.left;
      }

      x = stack.pop() as Node<K, V>;
      yield x.entry;
      x = x.right;
    }
  }

  /**
   * Returns a new `Iterator` object that contains the key-value pairs in order.
   */
  entries(): IterableIterator<[K, V]> {
    return this[Symbol.iterator]();
  }

  /**
   * Returns a new `Iterator` object that contains the keys in order.
   */
  *keys(): IterableIterator<K> {
    for (const [k, _] of this) {
      yield k;
    }
  }

  /**
   * Returns a new `Iterator` object that contains the values in order.
   */
  *values(): IterableIterator<V> {
    for (const [_, v] of this) {
      yield v;
    }
  }

  get [Symbol.toStringTag]() {
    return 'TreeMap';
  }

  private compare(a: K, b: K): number {
    if (this.compareFn) return this.compareFn(a, b);

    const strA = String(a);
    const strB = String(b);

    if (strA < strB) {
      return -1;
    } else if (strA > strB) {
      return 1;
    } else {
      return 0;
    }
  }

  private isRed(x?: Node<K, V>) {
    if (!x) return false;
    return x.color === Node.RED;
  }

  /**
   * Makes a right-leaning red link to a left-leaning one
   */
  private rotateLeft(h: Node<K, V>): Node<K, V> {
    assertIsDefined(h.right);

    const x = h.right;
    h.right = x.left;
    x.left = h;
    x.color = h.color;
    h.color = Node.RED;
    x.size = h.size;
    h.size = 1 + this._size(h.left) + this._size(h.right);
    return x;
  }

  /**
   * Makes a left-leaning red link to a right-leaning one
   */
  private rotateRight(h: Node<K, V>): Node<K, V> {
    assertIsDefined(h.left);

    const x = h.left;
    h.left = x.right;
    x.right = h;
    x.color = h.color;
    h.color = Node.RED;
    x.size = h.size;
    h.size = 1 + this._size(h.left) + this._size(h.right);
    return x;
  }

  /**
   * Flips the colors of a node and it's children
   */
  private flipColors(h: Node<K, V>): void {
    assertIsDefined(h.left);
    assertIsDefined(h.right);

    h.color = !h.color;
    h.left.color = !h.left.color;
    h.right.color = !h.right.color;
  }

  /**
   * Assuming that h is red and both h.left and h.left.left are black, make h.left or one of its
   * children red.
   */
  private moveRedLeft(h: Node<K, V>): Node<K, V> {
    assertIsDefined(h.left);
    assertIsDefined(h.right);

    this.flipColors(h);
    if (this.isRed(h.right.left)) {
      h.right = this.rotateRight(h.right);
      h = this.rotateLeft(h);
    }
    return h;
  }

  /**
   * Assuming that h is red and both h.right and h.right.left are black, make h.right or one of its
   * children red.
   */
  private moveRedRight(h: Node<K, V>): Node<K, V> {
    assertIsDefined(h.left);
    assertIsDefined(h.right);

    this.flipColors(h);
    if (this.isRed(h.left.left)) {
      h = this.rotateRight(h);
      this.flipColors(h);
    }
    return h;
  }

  /**
   * Restore red-black tree invariant
   */
  private balance(h: Node<K, V>): Node<K, V> {
    if (this.isRed(h.right)) h = this.rotateLeft(h);
    // @ts-expect-error
    if (this.isRed(h.left) && this.isRed(h.left.left)) h = this.rotateRight(h);
    if (this.isRed(h.left) && this.isRed(h.right)) this.flipColors(h);
    h.size = this._size(h.left) + this._size(h.right) + 1;
    return h;
  }

  private _size(x?: Node<K, V>): number {
    if (!x) return 0;
    return x.size;
  }

  private _get(x: Node<K, V> | undefined, key: K): Node<K, V> | undefined {
    if (!x) return;

    const cmp = this.compare(key, x.key);

    if (cmp < 0) {
      return this._get(x.left, key);
    } else if (cmp > 0) {
      return this._get(x.right, key);
    } else {
      return x;
    }
  }

  private _set(h: Node<K, V> | undefined, key: K, value: V): Node<K, V> {
    if (!h) return new Node<K, V>(key, value, 1, Node.RED);

    const cmp = this.compare(key, h.key);

    if (cmp < 0) {
      h.left = this._set(h.left, key, value);
    } else if (cmp > 0) {
      h.right = this._set(h.right, key, value);
    } else {
      h.value = value;
    }

    if (this.isRed(h.right) && !this.isRed(h.left)) h = this.rotateLeft(h);
    // @ts-expect-error
    if (this.isRed(h.left) && this.isRed(h.left.left)) h = this.rotateRight(h);
    if (this.isRed(h.left) && this.isRed(h.right)) this.flipColors(h);

    h.size = this._size(h.left) + this._size(h.right) + 1;
    return h;
  }

  private _deleteMin(h: Node<K, V>): Node<K, V> | undefined {
    if (!h.left) return;

    if (!this.isRed(h.left) && !this.isRed(h.left.left)) {
      h = this.moveRedLeft(h);
    }
    h.left = this._deleteMin(h.left as Node<K, V>);
    return this.balance(h);
  }

  private _deleteMax(h: Node<K, V>): Node<K, V> | undefined {
    if (this.isRed(h.left)) h = this.rotateRight(h);
    if (!h.right) return;

    if (!this.isRed(h.right) && !this.isRed(h.right.left)) {
      h = this.moveRedRight(h);
    }
    h.right = this._deleteMax(h.right as Node<K, V>);
    return this.balance(h);
  }

  private _delete(h: Node<K, V>, key: K): Node<K, V> | undefined {
    if (this.compare(key, h.key) < 0) {
      if (!this.isRed(h.left) && !this.isRed((h.left as Node<K, V>).left)) {
        h = this.moveRedLeft(h);
      }
      h.left = this._delete(h.left as Node<K, V>, key);
    } else {
      if (this.isRed(h.left)) h = this.rotateRight(h);
      if (this.compare(key, h.key) === 0 && !h.right) return;

      if (!this.isRed(h.right) && !this.isRed((h.right as Node<K, V>).left)) {
        h = this.moveRedRight(h);
      }
      if (this.compare(key, h.key) === 0) {
        const x: Node<K, V> = this._min(h.right) as Node<K, V>;
        h.key = x.key;
        h.value = x.value;
        h.right = this._deleteMin(h.right as Node<K, V>);
      } else {
        h.right = this._delete(h.right as Node<K, V>, key);
      }
    }
    return this.balance(h);
  }

  private _min(x?: Node<K, V>): Node<K, V> | undefined {
    if (!x) return;
    if (!x.left) return x;
    return this._min(x.left);
  }

  private _max(x?: Node<K, V>): Node<K, V> | undefined {
    if (!x) return;
    if (!x.right) return x;
    return this._max(x.right);
  }

  private _floor(x: Node<K, V> | undefined, key: K): Node<K, V> | undefined {
    if (!x) return;

    const cmp = this.compare(key, x.key);

    if (cmp === 0) return x;
    if (cmp < 0) return this._floor(x.left, key);

    const t = this._floor(x.right, key);
    return t ? t : x;
  }

  private _ceil(x: Node<K, V> | undefined, key: K): Node<K, V> | undefined {
    if (!x) return;

    const cmp = this.compare(key, x.key);

    if (cmp === 0) return x;
    if (cmp > 0) return this._ceil(x.right, key);

    const t = this._ceil(x.left, key);
    return t ? t : x;
  }

  private _select(x: Node<K, V> | undefined, rank: number): Node<K, V> | undefined {
    if (!x) return;

    const t = this._size(x.left);

    if (rank < t) {
      return this._select(x.left, rank);
    } else if (rank > t) {
      return this._select(x.right, rank - t - 1);
    } else {
      return x;
    }
  }

  private _rank(x: Node<K, V> | undefined, key: K): number {
    if (!x) return 0;

    const cmp = this.compare(key, x.key);

    if (cmp < 0) {
      return this._rank(x.left, key);
    } else if (cmp > 0) {
      return 1 + this._size(x.left) + this._rank(x.right, key);
    } else {
      return this._size(x.left);
    }
  }

  /**
   * Are the node's size fields correct?
   * 
   * This method is used for testing purposes.
   */
  /* istanbul ignore next */
  isSizeConsistent(): boolean {
    return this._isSizeConsistent(this.root);
  }

  /* istanbul ignore next */
  private _isSizeConsistent(x?: Node<K, V>): boolean {
    if (!x) return true;
    if (x.size !== 1 + this._size(x.left) + this._size(x.right)) return false;
    return this._isSizeConsistent(x.left) && this._isSizeConsistent(x.right);
  }

  /**
   * Do `rank` and `select` give consistent result?
   * 
   * This method is used for testing purposes.
   */
  /* istanbul ignore next */
  isRankConsistent(): boolean {
    for (let i = 0; i < this.size; i++) {
      const entry = this.select(i);
      if (!entry || this.rank(entry[0]) !== i) return false;
    }
    for (const k of this.keys()) {
      const entry = this.select(this.rank(k));
      if (!entry || this.compare(k, entry[0]) !== 0) return false;
    }
    return true;
  }

  /**
   * Is this tree a binary search tree?
   * 
   * This method is used for testing purposes.
   */
  /* istanbul ignore next */
  isBst(): boolean {
    return this._isBst(this.root);
  }

  /* istanbul ignore next */
  private _isBst(x?: Node<K, V>): boolean {
    if (!x) return true;

    const min = this._max(x.left);
    const max = this._min(x.right);

    if (min && this.compare(x.key, min.key) <= 0) return false;
    if (max && this.compare(x.key, max.key) >= 0) return false;

    return this._isBst(x.left) && this._isBst(x.right);
  }

  /**
   * Are all red links lean left and at most one red link in a row on any path?
   * 
   * This method is used for testing purposes.
   */
  /* istanbul ignore next */
  is23(): boolean {
    return this._is23(this.root);
  }

  /* istanbul ignore next */
  private _is23(x?: Node<K, V>): boolean {
    if (!x) return true;
    if (this.isRed(x.right)) return false;
    if (this.isRed(x) && this.isRed(x.left)) return false;
    return this._is23(x.left) && this._is23(x.right);
  }

  /**
   * Do all paths from the root to a leaf have the same number of black links?
   * 
   * This method is used for testing purposes.
   */
  /* istanbul ignore next */
  isBalanced(): boolean {
    let black = 0; // the number of black links from the root to min
    let x = this.root;

    while (x) {
      if (!this.isRed(x)) black++;
      x = x.left;
    }

    return this._isBalanced(this.root, black);
  }

  /* istanbul ignore next */
  private _isBalanced(x: Node<K, V> | undefined, black: number): boolean {
    if (!x) return black === 0;
    if (!this.isRed(x)) black--;
    return this._isBalanced(x.left, black) && this._isBalanced(x.right, black);
  }
}

export default TreeMap;
