import { AssertionError } from 'assert';

export function assertIsDefined<T>(
  val: T,
  message: string | Error = `Expected 'val' to be defined, but received ${val}`
): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    if (message instanceof Error) throw message;
    throw new AssertionError({ actual: val, message });
  }
}
