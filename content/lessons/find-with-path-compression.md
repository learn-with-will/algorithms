---
slug: find-with-path-compression
title: "Find with Path Compression"
topic: graph-traversals-and-connectivity
kind: technique
summary: "Path compression flattens tree branches during find operations, pointing traversed nodes directly to the root."
tags: ["path-compression", "union-find", "optimization", "tree-flattening"]
related: ["disjoint-set-union-find-structure", "union-by-rank-and-size", "inverse-ackermann-complexity"]
---
> **In one line:** Path compression flattens tree depth during find operations by pointing traversed nodes directly to the root.

## The idea

When executing `find(x)`, the algorithm must walk along parent pointers from $x$ up to the root $r$. 

**Path compression** is a brilliant optimization: as the traversal unwinds, it updates the `parent` pointer of every node visited along the path to point **directly to the root $r$**.

```flow
x: Node X @primary
p: Parent P @blue
r: Root R @green
x -> p: before compression
p -> r
x -> r: after compression: X points directly to R!
```

The next time `find(x)` (or `find` on any descendant of the path) is invoked, the root is reached in a single hop!

## See it

One-line recursive path compression implementation:

```python
class OptimizedFindDSU:
    def __init__(self, n: int):
        self.parent = list(range(n))

    def find(self, x: int) -> int:
        # Two-pass recursive path compression:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Point directly to root!
        return self.parent[x]

dsu = OptimizedFindDSU(5)
# Create chain: 0 -> 1 -> 2 -> 3
dsu.parent[0] = 1
dsu.parent[1] = 2
dsu.parent[2] = 3

print("Before find, parent of 0 is:", dsu.parent[0])  # 1
root = dsu.find(0)
print("After find(0), parent of 0 is:", dsu.parent[0])   # 3 (flattened!)
```

## Go deeper

Path compression requires zero extra memory beyond recursive stack frames (or a temporary pointer in an iterative implementation).

Path compression by itself reduces the amortized cost of an operation from $O(n)$ down to $O(\log n)$. When combined with union by rank, performance reaches near-constant time.

From an algorithmic engineering perspective, understanding the precise operational characteristics of find with path compression allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Path compression mutates parent pointers during read operations; be aware if thread safety is required.
- Iterative two-pass path compression avoids recursion stack depth in memory-constrained runtimes.

## Remember

- Path compression points every visited node directly to the canonical root.
- Dramatically flattens tree depth during normal find queries.
- Subsequent find operations execute in instant O(1) time.
