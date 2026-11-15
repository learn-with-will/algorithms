---
slug: disjoint-set-union-find-structure
title: "Disjoint-Set Union-Find Structure"
topic: graph-traversals-and-connectivity
kind: concept
summary: "Union-find partitions elements into disjoint sets, supporting near-instantaneous set lookups and set merges."
tags: ["union-find", "disjoint-set", "data-structures", "equivalence"]
related: ["find-with-path-compression", "union-by-rank-and-size", "cycle-detection-with-union-find"]
---
> **In one line:** Union-find tracks non-overlapping partitions of elements, supporting find and union operations.

## The idea

A **Disjoint-Set (Union-Find)** data structure maintains a collection of disjoint (non-overlapping) dynamic sets $\mathcal{S} = \{S_1, S_2, \dots, S_k\}$ over a universe of $n$ elements. Each set is identified by a canonical representative element called the **root**.

Union-find supports three primitive operations:

| Operation | Purpose |
|---|---|
| `make_set(x)` | Creates a new set containing only the single element $x$. |
| `find(x)` | Returns the canonical root representative of the set containing $x$. |
| `union(x, y)` | Merges the two sets containing elements $x$ and $y$ into a single set. |

Elements are organized internally as directed trees: each element holds a pointer to its `parent`. A node is the canonical root of its set if and only if `parent[x] == x`.

## See it

Basic Union-Find structure in Python:

```python
class DisjointSet:
    def __init__(self, n: int):
        # Each element is initially its own root
        self.parent = list(range(n))

    def find(self, x: int) -> int:
        """Walk parent pointers up to root."""
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, x: int, y: int) -> None:
        """Merge sets containing x and y."""
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x != root_y:
            self.parent[root_x] = root_y  # Attach one root to other

ds = DisjointSet(5)
ds.union(0, 1)
ds.union(1, 2)
print("Are 0 and 2 connected?", ds.find(0) == ds.find(2))  # True
print("Are 0 and 3 connected?", ds.find(0) == ds.find(3))  # False
```

## Go deeper

Two elements $x$ and $y$ belong to the identical set if and only if `find(x) == find(y)`.

Without optimizations, naive union-find can create linear chains of parent pointers of depth $n$ (just like an unbalanced BST), causing `find()` to degrade to $O(n)$ time. Two classic optimizations — **path compression** and **union by rank** — eliminate this degradation completely.

From an algorithmic engineering perspective, understanding the precise operational characteristics of disjoint-set union-find structure allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- In naive union-find, linking roots arbitrarily can create degenerate pointer chains of depth n.
- Always call find() on both elements before performing a union to check if they already belong to the same set.

## Remember

- Union-find partitions elements into disjoint equivalence sets.
- Each set is identified by a canonical representative root node.
- find(x) == find(y) checks if two elements belong to the same connected component.
