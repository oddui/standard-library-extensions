/**
 * Find the index of `target` in sorted `array` using binary search. When there are multiple elements
 * that equal to `target`, return the lowest or highest index based on the value of `left`.
 * When there is no element that equals `target`, return the index at which `target` can be inserted
 * to maintain sorted order (which is also the number of elements that are smaller than `target`).
 * @param array 
 * @param target 
 * @param compareFn 
 * @param left when there are multiple elements that equal target, return the lowest index if left
 * is true, return the highest index otherwise.
 */
export function binarySearch<T>(
  array: T[],
  target: T,
  compareFn?: (a: T, b: T) => number,
  left: boolean = true
) {
  let lo = 0;
  let hi = array.length - 1;

  while (lo <= hi) {
    const mid: number = lo + Math.floor((hi - lo) / 2);

    if (compare(target, array[mid]) < 0) {
      hi = mid - 1;
    } else if (compare(target, array[mid]) > 0) {
      lo = mid + 1;
    } else {
      let i = mid;
      if (left) {
        while (--i >= 0 && compare(array[i], target) === 0);
        return i + 1;
      } else {
        while (++i < array.length && compare(array[i], target) === 0);
        return i - 1;
      }
    }
  }

  return lo;

  function compare(a: T, b: T): number {
    if (compareFn) return compareFn(a, b);

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
}

export default binarySearch;
