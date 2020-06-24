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
    expect(pq.min).toEqual(1);
    expect(pq.deleteMin()).toEqual(1);
    expect(pq.deleteMin()).toEqual(2);
    expect(pq.deleteMin()).toEqual(3);
    expect(pq.deleteMin()).toEqual(4);
    expect(pq.deleteMin()).toEqual(5);
    expect(() => pq.deleteMin()).toThrow();
  });
});
