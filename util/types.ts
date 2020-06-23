/**
 * Function used to determine the order of the keys. It is expected to return a
 * negative value if first argument is less than second argument, zero if they're equal and a
 * positive value otherwise.
 */
export type CompareFn<K> = (a: K, b: K) => number;

export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) throw new Error(msg ?? 'Assertion failed.');
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error( `Expected 'val' to be defined, but received ${val}`);
  }
}
