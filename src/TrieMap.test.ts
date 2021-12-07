import TrieMap from "./TrieMap";

describe("TrieMap", () => {
  let map: TrieMap<number>;

  beforeEach(() => (map = new TrieMap<number>()));

  it("smoke test", () => {
    expect(map.toString()).toBe("[object TrieMap]");

    map
      .set("she", 0)
      .set("sells", 1)
      .set("sea", 2)
      .set("shells", 3)
      .set("by", 4)
      .set("the", 5)
      .set("sea", 6)
      .set("shore", 7)
      .set("shell", 8)
      .set("", 9);

    expect(map.size).toBe(9);
    expect(map.get("sell")).toBeUndefined();
    expect(map.get("sells")).toBe(1);
    expect(map.get("selling")).toBeUndefined();
    expect([...map.keysWithPrefix("sh")]).toEqual([
      "shore",
      "she",
      "shell",
      "shells",
    ]);

    const entries = [
      ["", 9],
      ["the", 5],
      ["by", 4],
      ["sea", 6],
      ["sells", 1],
      ["shore", 7],
      ["she", 0],
      ["shell", 8],
      ["shells", 3],
    ];
    let i = 0;
    map.forEach(function (this: [], v, k, map) {
      expect(this).toBe(entries);
      expect([k, v]).toStrictEqual(entries[i++]);
    }, entries);
    expect([...map]).toStrictEqual(entries);
    expect([...map.entries()]).toStrictEqual(entries);
    expect([...map.keys()]).toStrictEqual(entries.map(([k, _]) => k));
    expect([...map.values()]).toStrictEqual(entries.map(([_, v]) => v));

    expect(map.delete("shell")).toBe(true);
    expect(map.size).toBe(8);
    map.clear();
    expect(map.size).toBe(0);
  });

  describe("entriesWithPrefix", () => {
    beforeEach(() => {
      map.set("she", 0).set("sells", 1).set("sea", 2).set("shells", 3);
    });

    it("yields all entries with key having the prefix", () => {
      expect([...map.entriesWithPrefix("sh")]).toStrictEqual([
        ["she", 0],
        ["shells", 3],
      ]);
    });

    it("yields nothing if no entry with key having the prefix", () => {
      expect([...map.entriesWithPrefix("test")]).toStrictEqual([]);
    });
  });

  describe("delete()", () => {
    beforeEach(() => {
      map.set("she", 0).set("sells", 1).set("sea", 2).set("shells", 3);
    });

    describe("with key not found", () => {
      it("returns false if no value in the node corresponding to the last character in the key", () => {
        expect(map.delete("shell")).toBe(false);
      });
      it("returns false if search terminated with an empty link", () => {
        expect(map.delete("shore")).toBe(false);
      });
    });

    describe("with key ending with a non-null link to a child", () => {
      const key = "she";
      beforeEach(() => map.delete(key));

      it("deletes key", () => {
        expect(map.has(key)).toBe(false);
      });
      it("updates node sizes", () => {
        expect(map.size).toBe(3);
      });
    });

    describe("with key ending with an empty node", () => {
      const key = "sells";
      beforeEach(() => map.delete(key));

      it("deletes key", () => {
        expect(map.has(key)).toBe(false);
      });
      it("deletes empty nodes", () => {
        expect(map._get("se")!.next.size).toBe(1);
      });
      it("updates node sizes", () => {
        expect(map.size).toBe(3);
      });
    });
  });
});
