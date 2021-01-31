import IndexPriorityQueue from './IndexPriorityQueue';

describe('IndexPriorityQueue', () => {
  it('smoke test', () => {
    const pq = new IndexPriorityQueue<string>(8);
    expect(pq.toString()).toBe('[object IndexPriorityQueue]');

    pq
      .set(0, 'P')
      .set(1, 'Q')
      .set(2, 'E')
      .set(3, 'X')
      .set(4, 'A')
      .set(5, 'M')
      .set(6, 'P')
      .set(7, 'L')
      .set(7, 'E');

    expect(() => pq.set(8, 'E')).toThrow(RangeError);
    expect(pq.size).toBe(8);
    expect(pq.min).toStrictEqual([4, 'A']);
    expect(pq.get(4)).toBe('A');
    expect(pq.delete(4)).toBe(true);
    expect(pq.delete(4)).toBe(false);
    expect(pq.delete(8)).toBe(false);

    // delete [2, 'E'], [7, 'E'], order is not guaranteed
    pq.deleteMin();
    pq.deleteMin();

    expect(pq.deleteMin()).toStrictEqual([5, 'M']);

    // delete [0, 'P'], [6, 'P'], order is not guaranteed
    pq.deleteMin();
    pq.deleteMin();

    expect(pq.deleteMin()).toStrictEqual([1, 'Q']);
    expect(pq.deleteMin()).toStrictEqual([3, 'X']);
    expect(pq.deleteMin()).toBeUndefined();
    expect(pq.min).toBeUndefined();
  });

  it('uses compareFn', () => {
    const pq = new IndexPriorityQueue<number>(3, (a, b) => a - b);

    pq
      .set(0, 10)
      .set(1, 2)
      .set(2, 3);

    expect(pq.min).toStrictEqual([1, 2]);
  });
});
