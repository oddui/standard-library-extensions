class Node<T> {
  public size: number;
  public next: Map<string, Node<T>>;

  constructor(public value?: T) {
    this.size = 0; // number of entries in this subtrie
    this.next = new Map();
  }
}

export class TrieMap<T> implements Map<string, T> {
  private root = new Node<T>();

  get size() {
    return this.root.size;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Returns node associated with key. This method is exposed for testability.
   * @param key
   * @returns
   */
  _get(key: string): Node<T> | undefined {
    let node: Node<T> | undefined = this.root;
    for (const c of key) {
      node = node.next.get(c);
      if (!node) break;
    }
    return node;
  }

  get(key: string): T | undefined {
    return this._get(key)?.value;
  }

  set(key: string, value: T): this {
    let node = this._get(key);
    if (node?.value !== undefined) {
      node.value = value;
      return this;
    }

    node = this.root;
    node.size++;
    for (const c of key) {
      if (!node.next.has(c)) node.next.set(c, new Node());
      node = node.next.get(c) as Node<T>;
      node.size++;
    }
    node.value = value;

    return this;
  }

  delete(key: string): boolean {
    const stack: [string, Node<T>][] = [["", this.root]];
    let node: Node<T> | undefined = this.root;
    for (const c of key) {
      node = node.next.get(c);
      if (!node) break;
      stack.push([c, node]);
    }
    if (node?.value === undefined) return false;

    // Delete value associated with key.
    node.value = undefined;

    // Delete empty nodes and update sizes.
    while (stack.length) {
      // @ts-expect-error: stack is not empty
      const [c, n]: [string, Node<T>] = stack.pop();
      n.size--;
      if (stack.length && !n.next.size) {
        stack[stack.length - 1][1].next.delete(c);
      }
    }
    return true;
  }

  clear(): void {
    this.root = new Node<T>();
  }

  *keysWithPrefix(prefix: string): IterableIterator<string> {
    for (const [k, _] of this.entriesWithPrefix(prefix)) {
      yield k;
    }
  }

  *entriesWithPrefix(prefix: string): IterableIterator<[string, T]> {
    const root = this._get(prefix);
    if (!root) return [];

    const stack = [["", root]];
    while (stack.length) {
      // @ts-expect-error: stack is not empty
      const [pre, node]: [string, Node<T>] = stack.pop();
      if (node.value !== undefined) yield [`${prefix}${pre}`, node.value];

      for (const [c, n] of node.next) {
        stack.push([`${pre}${c}`, n]);
      }
    }
  }

  /**
   * Calls `callbackFn` once for each key-value pair.
   * @param {CallbackFn} callbackFn
   * @param thisArg the `this` value for each invocation of `callbackFn`
   */
  forEach(
    callbackFn: (value: T, key: string, map: TrieMap<T>) => void,
    thisArg?: any
  ): void {
    for (const [k, v] of this) {
      callbackFn.call(thisArg, v, k, this);
    }
  }

  [Symbol.iterator](): IterableIterator<[string, T]> {
    return this.entriesWithPrefix("");
  }

  entries(): IterableIterator<[string, T]> {
    return this[Symbol.iterator]();
  }

  *keys(): IterableIterator<string> {
    for (const [k, _] of this) {
      yield k;
    }
  }

  *values(): IterableIterator<T> {
    for (const [_, v] of this) {
      yield v;
    }
  }

  get [Symbol.toStringTag]() {
    return "TrieMap";
  }
}

export default TrieMap;
