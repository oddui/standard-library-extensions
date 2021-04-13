import binarySearch from "./binarySearch";

describe("binarySearch", () => {
  const compareFn = (a: number, b: number) => a - b;

  it("converts elements into strings to compare order by default", () => {
    const array = [10, 6, 7, 8, 9];
    for (let i = 0; i < array.length; i++) {
      expect(binarySearch(array, array[i])).toEqual(i);
    }
  });

  it("uses compareFn", () => {
    const array = [6, 7, 8, 9, 10];
    for (let i = 0; i < array.length; i++) {
      expect(binarySearch(array, array[i], compareFn)).toEqual(i);
    }
  });

  it("returns the lowest or highest index when there are multiple elements that equal target", () => {
    const array = [6, 8, 8, 8, 10];
    expect(binarySearch(array, 8, compareFn)).toEqual(1);
    expect(binarySearch(array, 8, compareFn, false)).toEqual(3);
  });

  it("returns the index at which target can be inserted to maintain sorted order when there is no element that equals target", () => {
    const array = [6, 7, 8, 8, 10];
    expect(binarySearch(array, 9, compareFn)).toEqual(4);
    expect(binarySearch(array, 5, compareFn)).toEqual(0);
    expect(binarySearch(array, 11, compareFn)).toEqual(5);
  });
});
