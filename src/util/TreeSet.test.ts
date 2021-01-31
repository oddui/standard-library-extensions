import TreeSet from './TreeSet';

describe('TreeMap', () => {
  it('smoke test', () => {
    const set = new TreeSet<string>();
    expect(set.toString()).toBe('[object TreeSet]');

    set
      .add('S')
      .add('E')
      .add('A')
      .add('R')
      .add('C')
      .add('H')
      .add('E')
      .add('X')
      .add('A')
      .add('M')
      .add('P')
      .add('L')
      .add('E');

    expect(set.size).toBe(10);
    expect(set.has('A')).toBe(true);
    expect(set.has('@')).toBe(false);
    expect(set.min).toBe('A');
    expect(set.max).toBe('X');
    expect(set.floor('@')).toBeUndefined();
    expect(set.floor('E')).toBe('E');
    expect(set.floor('F')).toBe('E');
    expect(set.floor('[')).toBe('X');
    expect(set.ceil('@')).toBe('A');
    expect(set.ceil('R')).toBe('R');
    expect(set.ceil('Q')).toBe('R');
    expect(set.ceil('[')).toBeUndefined();
    expect(set.select(0)).toBe('A');
    expect(set.select(9)).toBe('X');
    expect(set.select(10)).toBeUndefined();
    expect(set.rank('A')).toBe(0);
    expect(set.rank('B')).toBe(1);
    expect(set.rank('[')).toBe(10);

    const keys = [
      'A',
      'C',
      'E',
      'H',
      'L',
      'M',
      'P',
      'R',
      'S',
      'X'
    ];
    let i = 0;
    set.forEach(function(this: [], v, k, map) {
      expect(this).toBe(keys);
      expect(v).toBe(keys[i]);
      expect(k).toBe(keys[i]);
      i++;
    }, keys);
    expect([...set]).toStrictEqual(keys);
    expect([...set.entries()]).toStrictEqual(keys.map(k => [k, k]));
    expect([...set.keys()]).toStrictEqual(keys);
    expect([...set.values()]).toStrictEqual(keys);

    expect(set.deleteMin()).toBe(true);
    expect(set.deleteMax()).toBe(true);
    expect(set.delete('H')).toBe(true);
    expect(set.delete('H')).toBe(false);

    set.clear();

    expect(set.min).toBeUndefined();
    expect(set.max).toBeUndefined();
    expect(set.deleteMin()).toBe(false);
    expect(set.deleteMax()).toBe(false);
  });
  
  it('uses compareFn', () => {
    const set = new TreeSet<number>((a, b) => a - b);

    set
      .add(10)
      .add(2);

    expect(set.min).toBe(2);
    expect(set.max).toBe(10);
  });
});
