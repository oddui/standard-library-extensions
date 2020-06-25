import PriorityQueue from './PriorityQueue';

describe('PriorityQueue', () => {
  it('interface', () => {
    const pq = new PriorityQueue<number>(5, (a, b) => a - b);
    pq.add(5);
    pq.add(1);
    pq.add(2);
    pq.add(3);
    pq.add(4);
    expect(() => pq.add(5)).toThrow();
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
