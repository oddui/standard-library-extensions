import { AssertionError } from 'assert';

/**
 * Function used to determine the order of the keys. It is expected to return a
 * negative value if first argument is less than second argument, zero if they're equal and a
 * positive value otherwise.
 */
export type CompareFn<K> = (a: K, b: K) => number;

export function assertIsDefined<T>(
  val: T,
  message: string | Error = `Expected 'val' to be defined, but received ${val}`
): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    if (message instanceof Error) throw message;
    throw new AssertionError({ actual: val, message });
  }
}
