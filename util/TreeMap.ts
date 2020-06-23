import { CompareFn, assert, assertIsDefined } from './types';

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
 */
export class TreeMap<K, V> implements Map<K, V> {
  private root?: Node<K, V>;
  private compareFn?: (a: K, b: K) => number;

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
   * Returns the number of entries in this map.
   */
  get size(): number {
    return this._size(this.root);
  }

  /**
   * Returns the height of the BST (a 1-node tree has height 0). This method is mostly used for
   * debugging and testing.
   */
  get height(): number {
    return this._height(this.root);
  }

  /**
   * Returns the black height of the red-black BST (a 1-node tree has height 0). This method is
   * mostly used for debugging and testing.
   */
  get blackHeight(): number {
    return this._blackHeight(this.root);
  }

  /**
   * Does this map contain the given key?
   * @param key
   */
  has(key: K): boolean {
    return this._get(this.root, key) ? true : false;
  }

  /**
   * Returns the value associated with the given key. Or `undefined` if this map does not contain
   * the given key. A return value of `undefined` does not necessarily indicate that this map does
   * not contain the key. It's also possible that the map explicitly maps the key to `undefined`.
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

  deleteMin(key: K): boolean {
    throw new Error('Method not implemented.');
  }

  deleteMax(key: K): boolean {
    throw new Error('Method not implemented.');
  }

  delete(key: K): boolean {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Returns the entry with the smallest key.
   */
  get min(): [K, V] | undefined {
    return this._min(this.root)?.entry;
  }

  /**
   * Returns the entry with the largest key.
   */
  get max(): [K, V] | undefined {
    return this._max(this.root)?.entry;
  }

  /**
   * Returns the entry with the largest key less than or equal to `key`.
   * @param key
   */
  floor(key: K): [K, V] | undefined {
    return this._floor(this.root, key)?.entry;
  }

  /**
   * Returns the entry with the smallest key greater than or equal to `key`.
   * @param key
   */
  ceil(key: K): [K, V] | undefined {
    return this._ceil(this.root, key)?.entry;
  }

  /**
   * Return the entry of a given `rank`.
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

  forEach(callbackfn: (value: V, key: K, map: TreeMap<K, V>) => void, thisArg?: any): void {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    throw new Error('Method not implemented.');
  }

  entries(): IterableIterator<[K, V]> {
    throw new Error('Method not implemented.');
  }

  keys(): IterableIterator<K> {
    throw new Error('Method not implemented.');
  }

  values(): IterableIterator<V> {
    throw new Error('Method not implemented.');
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

  private _size(x?: Node<K, V>): number {
    if (!x) return 0;
    return x.size;
  }

  private _height(x?: Node<K, V>): number {
    if (!x) return -1;

    return 1 + Math.max(
      this._height(x.left),
      this._height(x.right)
    );
  }

  private _blackHeight(x?: Node<K, V>): number {
    if (!x) return -1;

    return (this.isRed(x) ? 0: 1) + Math.max(
      this._blackHeight(x.left),
      this._blackHeight(x.right)
    );
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
    assert(this.isRed(h.right));

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
    assert(this.isRed(h.left));

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
    assert(
      (!this.isRed(h) && this.isRed(h.left) && this.isRed(h.right)) ||
      (this.isRed(h) && !this.isRed(h.left) && !this.isRed(h.right))
    );

    h.color = Node.RED;
    h.left.color = Node.BLACK;
    h.right.color = Node.BLACK;
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
    if (this.isRed(h.left) && this.isRed(h.left?.left)) h = this.rotateRight(h);
    if (this.isRed(h.left) && this.isRed(h.right)) this.flipColors(h);

    h.size = this._size(h.left) + this._size(h.right) + 1;
    return h;
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
}

export default TreeMap;
