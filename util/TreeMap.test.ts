import TreeMap from './TreeMap';

describe('TreeMap', () => {
  let map: TreeMap<string, number>;

  beforeEach(() => map = new TreeMap<string, number>());

  it('interface', () => {
    expect(map.min).toBeUndefined();
    expect(map.max).toBeUndefined();

    map.set('S', 0);
    map.set('E', 1);
    map.set('A', 2);
    map.set('R', 3);
    map.set('C', 4);
    map.set('H', 5);
    map.set('E', 6);
    map.set('X', 7);
    map.set('A', 8);
    map.set('M', 9);
    map.set('P', 10);
    map.set('L', 11);
    map.set('E', 12);

    expect(map.size).toBe(10);
    expect(map.height).toBe(3);
    expect(map.blackHeight).toBe(2);
    expect(map.get('A')).toBe(8);
    expect(map.get('KEY')).toBeUndefined();
    expect(map.min).toStrictEqual(['A', 8]);
    expect(map.max).toStrictEqual(['X', 7]);
    expect(map.floor('E')).toStrictEqual(['E', 12]);
    expect(map.floor('F')).toStrictEqual(['E', 12]);
    expect(map.floor('@')).toBeUndefined();
    expect(map.ceil('R')).toStrictEqual(['R', 3]);
    expect(map.ceil('Q')).toStrictEqual(['R', 3]);
    expect(map.ceil('Z')).toBeUndefined();
    expect(map.select(0)).toStrictEqual(['A', 8]);
    expect(map.select(9)).toStrictEqual(['X', 7]);
    expect(map.select(10)).toBeUndefined();
    expect(map.rank('A')).toBe(0);
    expect(map.rank('B')).toBe(1);
    expect(map.rank('Z')).toBe(10);
  });

  it('perfect black balance', () => {
    for (let i = 0; i < 1_023; i++) map.set(String(i), i);

    expect(map.size).toBe(1_023);
    // a perfectly balanced binary tree of height 9 have 1023 nodes (2 ** 10 - 1)
    expect(map.blackHeight).toBeLessThan(9);
  });
});
