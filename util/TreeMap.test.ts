import TreeMap from './TreeMap';

describe('TreeMap', () => {
  let map: TreeMap<string, number>;

  beforeEach(() => map = new TreeMap<string, number>());

  it('smoke test', () => {
    expect(map.toString()).toBe('[object TreeMap]');

    map
      .set('S', 0)
      .set('E', 1)
      .set('A', 2)
      .set('R', 3)
      .set('C', 4)
      .set('H', 5)
      .set('E', 6)
      .set('X', 7)
      .set('A', 8)
      .set('M', 9)
      .set('P', 10)
      .set('L', 11)
      .set('E', 12);

    expect(map.size).toBe(10);
    expect(map.get('A')).toBe(8);
    expect(map.get('@')).toBeUndefined();
    expect(map.min).toStrictEqual(['A', 8]);
    expect(map.max).toStrictEqual(['X', 7]);
    expect(map.floor('E')).toStrictEqual(['E', 12]);
    expect(map.floor('F')).toStrictEqual(['E', 12]);
    expect(map.ceil('R')).toStrictEqual(['R', 3]);
    expect(map.ceil('Q')).toStrictEqual(['R', 3]);
    expect(map.select(0)).toStrictEqual(['A', 8]);
    expect(map.select(9)).toStrictEqual(['X', 7]);
    expect(map.select(10)).toBeUndefined();
    expect(map.rank('A')).toBe(0);
    expect(map.rank('B')).toBe(1);
    expect(map.rank('[')).toBe(10);

    const entries = [
      [ 'A', 8 ],
      [ 'C', 4 ],
      [ 'E', 12 ],
      [ 'H', 5 ],
      [ 'L', 11 ],
      [ 'M', 9 ],
      [ 'P', 10 ],
      [ 'R', 3 ],
      [ 'S', 0 ],
      [ 'X', 7 ]
    ];
    let i = 0;
    map.forEach(function(this: [], v, k, map) {
      expect(this).toBe(entries);
      expect([k, v]).toStrictEqual(entries[i++]);
    }, entries);
    expect([...map]).toStrictEqual(entries);
    expect([...map.entries()]).toStrictEqual(entries);
    expect([...map.keys()]).toStrictEqual(entries.map(([k, _]) => k));
    expect([...map.values()]).toStrictEqual(entries.map(([_, v]) => v));

    expect(map.deleteMin()).toBe(true);
    expect(map.deleteMax()).toBe(true);
    expect(map.delete('H')).toBe(true);
    map.clear();
    expect(map.size).toBe(0);
  });

  it('satisfies red-black BST properties', () => {
    const size = 2_000;
    const randomKey = () => String(Math.floor(Math.random() * size));

    for (let i = 0; i < size; i++) {
      map.set(String(i), i);
    }

    // delete 1000 random keys then add them back
    new Array(1000)
      .fill(null)
      .map(_ => {
        let key = randomKey();
        while (!map.delete(key)) {
          key = randomKey();
        }
        return key;
      })
      .forEach(key => map.set(key, Number.parseInt(key)));

    expect(map.size).toBe(size);
    expect(map.isSizeConsistent()).toBe(true);
    expect(map.isRankConsistent()).toBe(true);
    expect(map.isBst()).toBe(true);
    expect(map.is23()).toBe(true);
    expect(map.isBalanced()).toBe(true);
  });

  it('uses compareFn', () => {
    const map = new TreeMap<number, number>((a, b) => a - b);

    map
      .set(10, 10)
      .set(2, 2);

    expect(map.min).toStrictEqual([2, 2]);
    expect(map.max).toStrictEqual([10, 10]);
  });

  it('deleteMin()', () => {
    map
      .set('S', 0)
      .set('E', 1)
      .set('A', 2);

    expect(map.min).toStrictEqual(['A', 2])
    expect(map.deleteMin()).toBe(true);
    expect(map.min).toStrictEqual(['E', 1])
    expect(map.deleteMin()).toBe(true);
    expect(map.min).toStrictEqual(['S', 0])
    expect(map.deleteMin()).toBe(true);
    expect(map.min).toBeUndefined();
    expect(map.deleteMin()).toBe(false);
  });

  it('deleteMax()', () => {
    map
      .set('S', 0)
      .set('E', 1)
      .set('A', 2);

    expect(map.max).toStrictEqual(['S', 0])
    expect(map.deleteMax()).toBe(true);
    expect(map.max).toStrictEqual(['E', 1])
    expect(map.deleteMax()).toBe(true);
    expect(map.max).toStrictEqual(['A', 2])
    expect(map.deleteMax()).toBe(true);
    expect(map.max).toBeUndefined();
    expect(map.deleteMax()).toBe(false);
  });

  it('delete()', () => {
    map
      .set('S', 0)
      .set('E', 1)
      .set('A', 2);

    expect(map.delete('E')).toBe(true);
    expect(map.delete('E')).toBe(false);
    expect(map.delete('A')).toBe(true);
    expect(map.delete('A')).toBe(false);
    expect(map.delete('S')).toBe(true);
    expect(map.delete('S')).toBe(false);
  });

  it('floor()', () => {
    map
      .set('S', 0)
      .set('E', 1)
      .set('A', 2)
      .set('R', 3);

    expect(map.floor('@')).toBeUndefined();
    expect(map.floor('A')).toStrictEqual(['A', 2]);
    expect(map.floor('B')).toStrictEqual(['A', 2]);
    expect(map.floor('E')).toStrictEqual(['E', 1]);
    expect(map.floor('F')).toStrictEqual(['E', 1]);
    expect(map.floor('R')).toStrictEqual(['R', 3]);
    expect(map.floor('S')).toStrictEqual(['S', 0]);
    expect(map.floor('[')).toStrictEqual(['S', 0]);
  });

  it('ceil()', () => {
    map
      .set('S', 0)
      .set('E', 1)
      .set('A', 2)
      .set('R', 3);

    expect(map.ceil('@')).toStrictEqual(['A', 2]);
    expect(map.ceil('A')).toStrictEqual(['A', 2]);
    expect(map.ceil('B')).toStrictEqual(['E', 1]);
    expect(map.ceil('E')).toStrictEqual(['E', 1]);
    expect(map.ceil('F')).toStrictEqual(['R', 3]);
    expect(map.ceil('R')).toStrictEqual(['R', 3]);
    expect(map.ceil('S')).toStrictEqual(['S', 0]);
    expect(map.ceil('[')).toBeUndefined();
  });
});
