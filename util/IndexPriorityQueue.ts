import { CompareFn } from './helper';

/**
 * An index priority queue based on binary heap. It does not preserve the insertion order of equal
 * keys. An index priority queue is similar to an array but with fast access to the smallest entry.
 * 
 * This implementation provides O(log(n)) time for `set, delete and deleteMin`; constant time for
 * `min`, `size`, `has` and `get`.
 */
export class IndexPriorityQueue<K> {
  /**
   * Array based binary heap with pq[0] unused and the heap in pq[1] through pq[n].
   */
  private pq: Array<number>;
  private qp: Array<number>;
  private keys: Array<K>;
  private n: number = 0;
  private compareFn?: CompareFn<K>;

  /**
   * Creates an `IndexPriorityQueue` with the specified capacity that orders its keys according to
   * the specified compare function.
   * @param capacity the capacity for this index priority queue
   * @param compareFn Function used to determine the order of the keys. It is expected to return a
   * negative value if first argument is less than second argument, zero if they're equal and a
   * positive value otherwise. If omitted, the keys are compared in ASCII character order.
   * ```ts
   * const pq = new IndexPriorityQueue<number>((a, b) => a - b);
   * ```
   */
  constructor(capacity: number, compareFn?: CompareFn<K>) {
    this.compareFn = compareFn;
    this.pq = new Array(capacity + 1);
    this.qp = new Array(capacity);
    this.keys = new Array(capacity);

    for (let i = 0; i < capacity; i++) {
      this.qp[i] = -1;
    }
  }

  /**
   * Returns the entry with the smallest key. If multiple keys are smallest, it may return any of
   * them.
   */
  get min(): [number, K] | undefined {
    if (this.n === 0) return;
    const minIndex = this.pq[1] as number;
    return [minIndex, this.keys[minIndex]];
  }

  /**
   * Returns the number of entries in this priority queue.
   */
  get size(): number {
    return this.n;
  }

  /**
   * Does this index priority queue contain `i`?
   * @param i
   */
  has(i: number): boolean {
    return i >= 0 && i < this.qp.length && this.qp[i] !== -1;
  }

  /**
   * Returns the key associated with index `i`. Or `undefined` if the given index does not exist. A
   * return value of `undefined` does not necessarily indicate that the index does not exist. It's
   * also possible that the index explicitly associates to `undefined`. The `has` operation may be
   * used to distinguish these two cases.
   * @param i the index whose associated key is to be returned
   * @return the key associated with the given index, or `undefined` if the index does not exist
   */
  get(i: number): K | undefined {
    return this.keys[i];
  }

  /**
   * Inserts `key` and associate it with index `i`, overwriting the old key if `i` alreay exists.
   * @param i
   * @param key
   * @returns this index priority queue object
   */
  set(i: number, key: K): IndexPriorityQueue<K> {
    if (i < 0 || i > this.keys.length - 1) throw new RangeError();

    if (this.has(i)) {
      const j = this.qp[i] as number;
      this.keys[i] = key;
      this.swim(j);
      this.sink(j);
    } else {
      this.n++;
      this.pq[this.n] = i;
      this.qp[i] = this.n;
      this.keys[i] = key;
      this.swim(this.n);
    }

    return this;
  }

  /**
   * Deletes index `i` and it's associated key.
   * @param i
   * @returns `true` if the index existed and has been removed, or `false` if the index does not exist
   */
  delete(i: number): boolean {
    if (!this.has(i)) return false;

    const j = this.qp[i] as number;
    this.exch(j, this.n--);
    this.swim(j);
    this.sink(j);
    delete this.pq[this.n + 1];
    this.qp[i] = -1;
    delete this.keys[i];
    return true;
  }

  /**
   * Deletes and returns the entry with the smallest key.
   * @returns the smallest entry or `undefined` if this index priority queue is empty.
   */
  deleteMin(): [number, K] | undefined {
    const min = this.min;
    if (!min) return;

    const minIndex = min[0];
    this.exch(1, this.n--);
    this.sink(1);
    delete this.pq[this.n + 1];
    this.qp[minIndex] = -1;
    delete this.keys[minIndex];
    return min;
  }

  get [Symbol.toStringTag]() {
    return 'IndexPriorityQueue';
  }

  private less(i: number, j: number): boolean {
    if (this.compareFn) {
      return this.compareFn(
        this.keys[this.pq[i] as number] as K,
        this.keys[this.pq[j] as number] as K
      ) < 0;
    }

    return String(this.keys[this.pq[i] as number]) < String(this.keys[this.pq[j] as number]);
  }

  private exch(i: number, j: number): void {
    const tmpIndex = this.pq[i] as number;
    this.pq[i] = this.pq[j];
    this.qp[this.pq[j] as number] = i; 
    this.pq[j] = tmpIndex;
    this.qp[tmpIndex] = j;
  }

  private swim(i: number): void {
    let j = Math.floor(i / 2);

    while (j > 0 && this.less(i, j)) {
      this.exch(i, j);
      i = j;
      j = Math.floor(i / 2);
    }
  }

  private sink(i: number): void {
    let j = 2 * i;

    while (j <= this.n) {
      if (j + 1 <= this.n && this.less(j + 1, j)) j++;
      if (this.less(i, j)) break;

      this.exch(i, j);
      i = j;
      j = 2 * i;
    }
  }
}

export default IndexPriorityQueue;
