/**
 * Weighted quick union with path compression.
 */
export class UnionFind<T> {
  nodes = new Map<T, T>();
  sizes = new Map<T, number>();
  private _count = 0;

  get [Symbol.toStringTag]() {
    return "UnionFind";
  }

  /**
   * The number of components
   */
  get count() {
    return this._count;
  }

  /**
   * Check if p and q are in the same component.
   * @param p
   * @param q
   * @returns
   */
  connected(p: T, q: T) {
    return this.find(p) === this.find(q);
  }

  add(p: T) {
    this.nodes.set(p, p);
    this.sizes.set(p, 1);
    this._count++;
  }

  /**
   * Find the component for p.
   * @param p
   * @returns
   */
  find(p: T): T {
    if (!this.nodes.has(p)) throw new Error("Node does not exist.");

    // @ts-expect-error
    const q: T = this.nodes.get(p);
    if (q === p) return q;

    const component = this.find(q);
    this.nodes.set(p, component);
    return component;
  }

  /**
   * Add connection between p and q.
   * @param p
   * @param q
   * @returns
   */
  union(p: T, q: T) {
    const componentP = this.find(p);
    const componentQ = this.find(q);
    if (componentP === componentQ) return;

    const componentPSize = this.sizes.get(componentP) as number;
    const componentQSize = this.sizes.get(componentQ) as number;

    if (componentPSize < componentQSize) {
      this.nodes.set(componentP, componentQ);
      this.sizes.set(componentQ, componentPSize + componentQSize);
    } else {
      this.nodes.set(componentQ, componentP);
      this.sizes.set(componentP, componentPSize + componentQSize);
    }
    this._count--;
  }
}

export default UnionFind;
