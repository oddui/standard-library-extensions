import PriorityQueue from './PriorityQueue';

describe('PriorityQueue', () => {
  it('interface', () => {
    const pq = new PriorityQueue<number>(5, (a, b) => a - b);
    pq.insert(5);
    pq.insert(1);
    pq.insert(2);
    pq.insert(3);
    pq.insert(4);
    expect(() => pq.insert(5)).toThrow();
    expect(pq.size).toEqual(5);
    expect(pq.leastKey).toEqual(1);
    expect(pq.deleteLeast()).toEqual(1);
    expect(pq.deleteLeast()).toEqual(2);
    expect(pq.deleteLeast()).toEqual(3);
    expect(pq.deleteLeast()).toEqual(4);
    expect(pq.deleteLeast()).toEqual(5);
    expect(() => pq.deleteLeast()).toThrow();
  });
});
