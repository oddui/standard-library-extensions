import IndexPriorityQueue from './IndexPriorityQueue';

describe('IndexPriorityQueue', () => {
  it('interface', () => {
    const pq = new IndexPriorityQueue<string>(8);

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
    expect(pq.size).toEqual(8);
    expect(pq.min).toStrictEqual([4, 'A']);
    expect(pq.get(4)).toEqual('A');
    expect(pq.delete(4)).toEqual(true);
    expect(pq.delete(4)).toEqual(false);
    expect(pq.delete(8)).toEqual(false);

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
});
