/**
 * A priority queue based on binary heap. The head of this queue is the least key with respect to
 * the specified ordering.
 */
export class PriorityQueue<K> {
  /**
   * Array based binary heap with pq[0] unused and the heap in pq[1] through pq[n].
   */
  private pq: Array<K | null>;
  private n: number = 0;
  private compareFn?: (a: K, b: K) => number;

  constructor(capacity: number, compareFn?: (a: K, b: K) => number) {
    this.compareFn = compareFn;
    this.pq = new Array(capacity + 1).fill(null);
  }

  get leastKey(): K {
    if (this.n === 0) throw new Error();

    return this.pq[1] as K;
  }

  get size(): number {
    return this.n;
  }

  insert(key: K): void {
    if (this.n === this.pq.length - 1) throw new Error();

    this.pq[++this.n] = key;
    this.swim(this.n);
  }

  deleteLeast(): K {
    const leastKey = this.leastKey;
    this.pq[1] = this.pq[this.n];
    this.pq[this.n--] = null;
    this.sink(1);
    return leastKey;
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
