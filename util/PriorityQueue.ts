import { CompareFn } from './helper';

/**
 * A priority queue based on binary heap. It does not preserve the insertion order of equal keys.
 * 
 * This implementation provides O(log(n)) time for `add and deleteMin`; constant time for `min` and
 * `size`.
 */
export class PriorityQueue<K> {
  /**
   * Array based binary heap with pq[0] unused and the heap in pq[1] through pq[n].
   */
  private pq: Array<K>;
  private n: number = 0;
  private compareFn?: CompareFn<K>;

  /**
   * Creates a `PriorityQueue` with the specified capacity that orders its keys according to the
   * specified compare function.
   * @param capacity the capacity for this priority queue
   * @param compareFn Function used to determine the order of the keys. It is expected to return a
   * negative value if first argument is less than second argument, zero if they're equal and a
   * positive value otherwise. If omitted, the keys are compared in ASCII character order.
   * ```ts
   * const pq = new PriorityQueue<number>((a, b) => a - b);
   * ```
   */
  constructor(capacity: number, compareFn?: (a: K, b: K) => number) {
    this.compareFn = compareFn;
    this.pq = new Array(capacity + 1);
  }

  /**
   * Returns the smallest key or `undefined` if this priority queue is empty. A return value of
   * `undefined` does not necessarily indicate that this priority queue is empty. It's also
   * possible that the priority queue explicitly has the smallest key as `undefined`.
   */
  get min(): K | undefined {
    if (this.n === 0) return;
    return this.pq[1] as K;
  }

  /**
   * Returns the number of keys in this priority queue.
   */
  get size(): number {
    return this.n;
  }

  /**
   * Adds `key` to this priority queue.
   * @param key
   * @returns this priority queue object
   */
  add(key: K): PriorityQueue<K> {
    if (this.n === this.pq.length - 1) throw new RangeError();

    this.pq[++this.n] = key;
    this.swim(this.n);
    return this;
  }

  /**
   * Deletes and returns the smallest key.
   * @returns the smallest key or `undefined` if this priority queue is empty.
   */
  deleteMin(): K | undefined {
    if (this.n === 0) return;

    const min = this.min;
    this.pq[1] = this.pq[this.n];
    delete this.pq[this.n--];
    this.sink(1);
    return min;
  }

  get [Symbol.toStringTag]() {
    return 'PriorityQueue';
  }

  private less(i: number, j: number): boolean {
    if (this.compareFn) return this.compareFn(this.pq[i] as K, this.pq[j] as K) < 0;
    return String(this.pq[i]) < String(this.pq[j]);
  }

  private exch(i: number, j: number): void {
    const t = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = t;
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

export default PriorityQueue;
