import UnionFind from './UnionFind';

describe('UnionFind', () => {
  it('smoke test', () => {
    const pairs = [
      [4, 3],
      [3, 8],
      [6, 5],
      [9, 4],
      [2, 1],
      [8, 9],
      [5, 0],
      [7, 2],
      [6, 1],
      [1, 0],
      [6, 7],
    ];
    const uf = new UnionFind<number>();
    for (let i = 0; i < 10; i++) {
      uf.add(i);
    }
    for (const [p, q] of pairs) {
      uf.union(p, q);
    }

    expect(uf.toString()).toBe('[object UnionFind]');
    expect(uf.count).toBe(2);
    expect(uf.connected(4, 6)).toBe(false);
    expect(uf.find(0)).toBe(6);
    expect(uf.find(1)).toBe(6);
    expect(uf.find(2)).toBe(6);
    expect(uf.find(3)).toBe(4);
    expect(uf.find(4)).toBe(4);
    expect(uf.find(5)).toBe(6);
    expect(uf.find(6)).toBe(6);
    expect(uf.find(7)).toBe(6);
    expect(uf.find(8)).toBe(4);
    expect(uf.find(9)).toBe(4);
    expect(() => uf.find(10)).toThrowError();
    expect(() => uf.union(0, 10)).toThrowError();
  });
});
