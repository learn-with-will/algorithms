---
slug: union-by-rank-and-size
title: "Union by Rank and Size"
topic: graph-traversals-and-connectivity
kind: technique
summary: "Union by rank attaches shallower trees under roots of deeper trees, maintaining logarithmic maximum tree depth."
tags: ["union-by-rank", "union-by-size", "union-find", "optimization"]
related: ["disjoint-set-union-find-structure", "find-with-path-compression", "inverse-ackermann-complexity"]
---
> **In one line:** Union by rank always attaches the shallower tree under the root of the deeper tree.

## The idea

When merging two sets with `union(x, y)`, an arbitrary choice of which root points to which can double tree height, producing linear chains.

**Union by Rank** maintains an upper bound on tree height called `rank`:
- When merging two trees of different ranks, attach the root of the **smaller rank** tree under the root of the **larger rank** tree. The overall height does not increase!
- If both trees have identical rank, pick either root, attach the other, and increment the surviving root's rank by 1.

```tree
Tree A (Rank 2) Root
  Tree B (Rank 1) Attached Underneath
```

Alternatively, **Union by Size** tracks element counts, attaching smaller sets under larger sets. Both heuristics guarantee tree height never exceeds $\lfloor \log_2 n \rfloor$.

## See it

Complete Union-Find with union by rank and path compression:

```python
class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        rx, ry = self.find(x), self.find(y)
        if rx == ry: return False
        if self.rank[rx] < self.rank[ry]:
            self.parent[rx] = ry
        elif self.rank[rx] > self.rank[ry]:
            self.parent[ry] = rx
        else:
            self.parent[ry] = rx
            self.rank[rx] += 1
        return True
```

## Go deeper

Union by rank alone guarantees that for any node $x$, the size of its subtree is at least $2^{\text{rank}(x)}$, which mathematically bounds tree height to $\le \log_2 n$.

When path compression is introduced, ranks no longer equal exact tree heights (because trees flatten while ranks remain unchanged), which is why we call it "rank" rather than "height".

From an algorithmic engineering perspective, understanding the precise operational characteristics of union by rank and size allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Only increment rank when the two merging roots have IDENTICAL rank.
- Do not update ranks using node indices; only update ranks at the root indices root_x and root_y.

## Remember

- Union by rank attaches shallower trees under roots of deeper trees.
- Prevents tree height from ever exceeding O(log n).
- Returns a boolean indicating whether a merge actually occurred.
