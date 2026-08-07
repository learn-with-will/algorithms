---
id: lesson-22
slug: union-find
title: "Union-Find (Disjoint Set Union)"
level: advanced
order: 22
duration: 28
tags:
  - union-find
  - disjoint-set
  - path-compression
  - union-by-rank
  - amortized
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the **disjoint-set** abstraction and its `find` and `union` operations.
- Implement union-find as a forest with parent pointers.
- Apply **union by rank/size** and **path compression** and explain their effect.
- State the near-constant `O(α(n))` amortized cost and what `α` is.
- Use union-find for connectivity, cycle detection, and Kruskal's MST.

# Why This Concept Exists

Some problems keep asking: "are these two things already in the same group?" and "merge these
two groups." Tracking connected components as edges are added, detecting cycles while building
a spanning tree, grouping pixels in an image — all need a structure that answers *connectivity*
queries and *merges* sets extremely fast. **Union-find** (a.k.a. disjoint-set union) does
exactly this, and with two small optimizations its operations are effectively `O(1)` — one of
the most elegant results in data-structure design.

# Concept Explanation

### The disjoint-set abstraction

Maintain a collection of **disjoint sets** (a partition of `n` elements) supporting:

- **`find(x)`** — return a canonical **representative** (root) of the set containing `x`. Two
  elements are in the same set iff they have the same representative.
- **`union(x, y)`** — merge the sets containing `x` and `y` into one.

### The forest representation

Represent each set as a tree; every element points to a **parent**, and each root points to
itself and serves as the set's representative. `find` walks parent pointers to the root;
`union` links one root under the other. Naively, this can build long chains and degrade to
`O(n)` per operation.

### Two optimizations that make it near-constant

- **Union by rank (or size).** When merging, attach the **shorter/smaller** tree under the
  **taller/larger** one. This keeps trees shallow, bounding height at `O(log n)`.
- **Path compression.** During `find`, make every node on the path point **directly to the
  root**, flattening the tree so future `find`s are faster.

Used **together**, the amortized cost per operation is `O(α(n))`, where `α` is the **inverse
Ackermann function** — a function that grows so slowly that `α(n) ≤ 4` for any `n` you could
ever store. So union-find is effectively constant time per operation.

### What it is used for

- **Connectivity** — are `x` and `y` connected? (`find(x) == find(y)`.)
- **Connected components** — count distinct representatives.
- **Cycle detection** in an undirected graph — an edge whose endpoints already share a root
  closes a cycle.
- **Kruskal's MST** — the cycle check that decides whether to add an edge (Lesson 21).

# Key Terminology

- **Disjoint sets** — a partition of elements into non-overlapping groups.
- **Representative / root** — the canonical element identifying a set.
- **Union by rank/size** — attach the smaller tree under the larger to stay shallow.
- **Path compression** — flatten the find path so nodes point straight to the root.
- **Inverse Ackermann `α(n)`** — the near-constant amortized factor (`≤ 4` in practice).

# Complexity

| Version | find / union (amortized) |
| ------- | ------------------------- |
| Naive forest | O(n) worst case |
| + union by rank | O(log n) |
| + path compression | O(log n) |
| union by rank **and** path compression | O(α(n)) ≈ O(1) |

Total for `m` operations on `n` elements: `O(m · α(n))`. Space is `O(n)`.

# Implementation in Python

```python
class UnionFind:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))     # each element is its own root
        self.rank = [0] * n              # upper bound on each tree's height

    def find(self, x: int) -> int:
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != root:    # path compression: point directly to root
            self.parent[x], x = root, self.parent[x]
        return root

    def union(self, x: int, y: int) -> bool:
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False                 # already together (would form a cycle)
        if self.rank[rx] < self.rank[ry]:  # union by rank: shorter under taller
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True

    def connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)
```

# Real World Analogy

Union-find tracks **friend groups merging at a party**. Each group has a designated "captain"
(the representative). To check if two people are in the same group, you ask each who their
captain is (`find`). To merge two groups, the smaller group's captain now reports to the larger
group's captain (`union` by size). Path compression is everyone updating their phone to the
top captain's number directly, so next time the lookup is instant.

# Examples

## Example 1 — Basic: connectivity queries

```python
uf = UnionFind(5)          # elements 0..4, all separate
uf.union(0, 1)
uf.union(2, 3)
uf.connected(0, 1)         # True
uf.connected(0, 2)         # False
uf.union(1, 2)             # now {0,1,2,3} are one set
uf.connected(0, 3)         # True
```

**Why this is good:** it shows the whole interface — merging sets and answering "same group?"
— and how transitivity emerges: connecting `1` and `2` links the `{0,1}` and `{2,3}` groups
into one.

## Example 2 — Real-world: count connected components

```python
def count_components(n: int, edges: list[tuple[int, int]]) -> int:
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return len({uf.find(i) for i in range(n)})   # distinct representatives
```

**Why this is good:** after unioning every edge, the number of distinct roots is the number of
connected components — a one-line answer to a common graph question, in near-linear time.

## Example 3 — Best practice / edge case: detect a cycle while adding edges

```python
def has_cycle(n: int, edges: list[tuple[int, int]]) -> bool:
    uf = UnionFind(n)
    for u, v in edges:
        if not uf.union(u, v):    # union returns False if u, v already connected
            return True           # this edge closes a cycle
    return False
```

**Why this is good:** this is exactly the check Kruskal's algorithm uses. If `union` reports
the endpoints were already connected, adding the edge would create a cycle — so you skip it.
The same near-constant operation powers MST construction.

# Common Mistakes

- **Omitting the optimizations.** Without union by rank *and* path compression, trees can
  become chains and operations degrade toward `O(n)`.
- **Comparing elements instead of roots.** Two elements are in the same set iff
  `find(x) == find(y)`; comparing `x == y` or parents directly is wrong.
- **Forgetting `union` can be a no-op.** If both elements share a root, there is nothing to
  merge (and, in cycle detection, that is the signal).
- **Using it for the wrong problem.** Union-find handles *disjoint* sets and connectivity; it
  cannot split sets apart or query set membership by value.

# Best Practices

- Always combine **union by rank/size** with **path compression** for near-constant operations.
- Use `find(x) == find(y)` to test connectivity; have `union` return whether a merge happened.
- Reach for union-find for **incremental connectivity** and **Kruskal's MST**.
- Keep it simple — the whole structure is two arrays (`parent`, `rank`) and two short methods.

# Summary

- Union-find maintains disjoint sets with `find` (representative) and `union` (merge).
- Represented as a parent-pointer forest, roots identify sets.
- **Union by rank** keeps trees shallow; **path compression** flattens them.
- Together they give `O(α(n))` amortized — effectively constant (`α(n) ≤ 4` in practice).
- It powers connectivity queries, connected components, cycle detection, and Kruskal's MST.

# Flash Cards

Q: What two operations does a union-find (disjoint-set) structure support?
A: find(x) returns the representative of x's set, and union(x, y) merges the two sets containing x and y.

Q: What does path compression do?
A: During find, it makes every node on the path point directly to the root, flattening the tree so later finds are faster.

Q: What does union by rank (or size) achieve?
A: It attaches the shorter/smaller tree under the taller/larger one, keeping trees shallow (height O(log n)).

Q: What is the amortized cost of union-find with both optimizations?
A: O(α(n)) per operation, where α is the inverse Ackermann function — at most about 4 for any practical n, so effectively constant.

Q: How do you test whether two elements are in the same set?
A: Check whether find(x) == find(y) — they share a representative.

Q: Which classic MST algorithm relies on union-find, and for what?
A: Kruskal's algorithm, to detect whether adding an edge would form a cycle (its endpoints already share a root).

# Exercises

### Easy
Using `UnionFind`, group the pairs `(0,1), (1,2), (3,4)` over 5 elements and report how many
connected components remain.

### Medium
Explain, with a small example, how a sequence of unions without union-by-rank can create a
tall chain, and how path compression alone would (or would not) fix later `find` costs.

### Challenging
Union-find can also handle **offline** dynamic connectivity but not deletions. Explain why
"un-union" (splitting a merged set) is hard for this structure, and sketch what extra
information you would need to support it.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 19
  ("Data Structures for Disjoint Sets"), including the `O(m α(n))` analysis.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 1.5 ("Case Study: Union-Find").
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Section 6.1.3 (union-find).
