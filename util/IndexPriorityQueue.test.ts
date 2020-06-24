import IndexPriorityQueue from './IndexPriorityQueue';

describe('IndexPriorityQueue', () => {
  it('interface', () => {
    const pq = new IndexPriorityQueue<number>(5, (a, b) => a - b);
    pq.set(0, 5);
    pq.set(1, 4);
    pq.set(2, 1);
    pq.set(3, 2);
    pq.set(4, 3);
    pq.set(0, 6);
    expect(() => pq.set(6, 5)).toThrow();
    expect(pq.size).toEqual(5);
    expect(pq.minIndex).toEqual(2);
    expect(pq.minKey).toEqual(1);
    pq.delete(4);
    expect(pq.deleteMin()).toEqual(2);
    expect(pq.deleteMin()).toEqual(3);
    expect(pq.deleteMin()).toEqual(1);
    expect(pq.deleteMin()).toEqual(0);
    expect(() => pq.deleteMin()).toThrow();
  });
});
