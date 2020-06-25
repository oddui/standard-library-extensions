import TreeMap from './TreeMap';

describe('TreeMap', () => {
  it('interface', () => {
    const map = new TreeMap<string, number>();

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
    expect(map.delete('H')).toBe(false);

    map.clear();

    expect(map.min).toBeUndefined();
    expect(map.max).toBeUndefined();
    expect(map.deleteMin()).toBe(false);
    expect(map.deleteMax()).toBe(false);
  });

  it('red-black BST properties', () => {
    const size = 2_000;
    const randomKey = () => String(Math.floor(Math.random() * size));
    const map = new TreeMap<string, number>();

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
});
