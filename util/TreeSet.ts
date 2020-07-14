import { CompareFn } from './types';
import TreeMap from './TreeMap';

/**
 * An ordered set implementation based on a {@link TreeMap}.
 */
export class TreeSet<T> implements Set<T> {
  // dummy value to associate with keys in the backing TreeMap
  private static PRESENT: boolean = true;
  private m: TreeMap<T, typeof TreeSet.PRESENT>;

  constructor(compareFn?: CompareFn<T>) {
    this.m = new TreeMap(compareFn);
  }

  get size(): number {
    return this.m.size;
  }

  has(key: T): boolean {
    return this.m.has(key);
  }

  add(key: T): this {
    this.m.set(key, TreeSet.PRESENT);
    return this;
  }

  delete(key: T): boolean {
    return this.m.delete(key);
  }

  clear(): void {
    return this.m.clear();
  }

  get min(): T | undefined {
    return this.m.min?.[0];
  }

  get max(): T | undefined {
    return this.m.max?.[0];
  }

  floor(key: T): T | undefined {
    return this.m.floor(key)?.[0];
  }

  ceil(key: T): T | undefined {
    return this.m.ceil(key)?.[0];
  }

  select(rank: number): T | undefined {
    return this.m.select(rank)?.[0];
  }

  rank(key: T): number {
    return this.m.rank(key);
  }

  deleteMin(): boolean {
    return this.m.deleteMin();
  }

  deleteMax(): boolean {
    return this.m.deleteMax();
  }

  /**
   * Calls `callbackFn` once for each key in key order.
   * @param {CallbackFn} callbackFn
   * @param thisArg the `this` value for each invocation of `callbackFn`
   */
  forEach(callbackFn: (value: T, key: T, set: Set<T>) => void, thisArg?: any): void {
    for (const k of this) {
      callbackFn.call(thisArg, k, k, this);
    }
  }

  /**
   * Returns a new `Iterator` object that contains the keys in order.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    for (const k of this.m.keys()) {
      yield k;
    }
  }

  /**
   * Returns a new `Iterator` object that contains `[key, key]` for each key in order.
   */
  *entries(): IterableIterator<[T, T]> {
    for (const k of this) {
      yield [k, k];
    }
  }

  /**
   * Returns a new `Iterator` object that contains the keys in order. This is the same as the
   * `values()` method.
   */
  keys(): IterableIterator<T> {
    return this[Symbol.iterator]();
  }

  /**
   * Returns a new `Iterator` object that contains the keys in order. This is the same as the
   * `keys()` method.
   */
  values(): IterableIterator<T> {
    return this[Symbol.iterator]();
  }

  get [Symbol.toStringTag]() {
    return 'TreeSet';
  }
}

export default TreeSet;
