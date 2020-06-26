import PriorityQueue from './PriorityQueue';

describe('PriorityQueue', () => {
  it('interface', () => {
    const pq = new PriorityQueue<string>(9);

    pq
      .add('P')
      .add('Q')
      .add('E')
      .add('X')
      .add('A')
      .add('M')
      .add('P')
      .add('L')
      .add('E');

    expect(() => pq.add('E')).toThrow(RangeError);
    expect(pq.size).toEqual(9);
    expect(pq.min).toEqual('A');
    expect(pq.deleteMin()).toEqual('A');
    expect(pq.deleteMin()).toEqual('E');
    expect(pq.deleteMin()).toEqual('E');
    expect(pq.deleteMin()).toEqual('L');
    expect(pq.deleteMin()).toEqual('M');
    expect(pq.deleteMin()).toEqual('P');
    expect(pq.deleteMin()).toEqual('P');
    expect(pq.deleteMin()).toEqual('Q');
    expect(pq.deleteMin()).toEqual('X');
    expect(pq.deleteMin()).toBeUndefined();
    expect(pq.min).toBeUndefined();
  });
});
