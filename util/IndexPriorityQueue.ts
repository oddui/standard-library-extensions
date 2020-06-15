/**
 * A priority queue based on binary heap. The head of this queue is the least key with respect to
 * the specified ordering.
 */
export class IndexPriorityQueue<K> {
  /**
   * Array based binary heap with pq[0] unused and the heap in pq[1] through pq[n].
   */
  private pq: Array<number | null>;
  private qp: Array<number | null>;
  private keys: Array<K | null>;
  private n: number = 0;
  private compareFn?: (a: K, b: K) => number;

  constructor(capacity: number, compareFn?: (a: K, b: K) => number) {
    this.compareFn = compareFn;
    this.pq = new Array(capacity + 1).fill(null);
    this.qp = new Array(capacity).fill(null);
    this.keys = new Array(capacity).fill(null);

    for (let i = 0; i <= capacity; i++) this.qp[i] = -1;
  }

  get leastIndex(): number {
    if (this.n === 0) throw new Error();

    return this.pq[1] as number;
  }

  get leastKey(): K {
    return this.keys[this.leastIndex] as K;
  }

  get size(): number {
    return this.n;
  }

  has(i: number): boolean {
    if (i > this.keys.length - 1) throw new Error();

    return this.qp[i] !== -1;
  }

  set(i: number, key: K): void {
    if (i > this.keys.length - 1) throw new Error();

    if (this.has(i)) {
      const j = this.qp[i] as number;
      this.keys[i] = key;
      this.swim(j);
      this.sink(j);
      return;
    }

    if (this.n === this.pq.length - 1) throw new Error();

    this.n++;
    this.pq[this.n] = i;
    this.qp[i] = this.n;
    this.keys[i] = key;
    this.swim(this.n);
  }

  delete(i: number): void {
    if (i >= this.keys.length) throw new Error();

    const j = this.qp[i] as number;
    this.exch(j, this.n--);
    this.swim(j);
    this.sink(j);
    this.pq[this.n + 1] = null;
    this.qp[i] = -1;
    this.keys[i] = null;
  }

  deleteLeast(): number {
    const leastIndex = this.leastIndex;
    this.exch(1, this.n--);
    this.sink(1);
    this.pq[this.n + 1] = null;
    this.qp[leastIndex] = -1;
    this.keys[leastIndex] = null;
    return leastIndex;
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
