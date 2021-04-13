import PriorityQueue from "./PriorityQueue";

describe("PriorityQueue", () => {
  it("smoke test", () => {
    const pq = new PriorityQueue<string>(9);
    expect(pq.toString()).toBe("[object PriorityQueue]");

    pq.add("P")
      .add("Q")
      .add("E")
      .add("X")
      .add("A")
      .add("M")
      .add("P")
      .add("L")
      .add("E");

    expect(() => pq.add("E")).toThrow(RangeError);
    expect(pq.size).toBe(9);
    expect(pq.min).toBe("A");
    expect(pq.deleteMin()).toBe("A");
    expect(pq.deleteMin()).toBe("E");
    expect(pq.deleteMin()).toBe("E");
    expect(pq.deleteMin()).toBe("L");
    expect(pq.deleteMin()).toBe("M");
    expect(pq.deleteMin()).toBe("P");
    expect(pq.deleteMin()).toBe("P");
    expect(pq.deleteMin()).toBe("Q");
    expect(pq.deleteMin()).toBe("X");
    expect(pq.deleteMin()).toBeUndefined();
    expect(pq.min).toBeUndefined();
  });

  it("uses compareFn", () => {
    const pq = new PriorityQueue<number>(3, (a, b) => a - b);
    pq.add(10).add(2).add(3);

    expect(pq.min).toBe(2);
  });
});
