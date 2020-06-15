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
    expect(pq.leastIndex).toEqual(2);
    expect(pq.leastKey).toEqual(1);
    pq.delete(4);
    expect(pq.deleteLeast()).toEqual(2);
    expect(pq.deleteLeast()).toEqual(3);
    expect(pq.deleteLeast()).toEqual(1);
    expect(pq.deleteLeast()).toEqual(0);
    expect(() => pq.deleteLeast()).toThrow();
  });
});
