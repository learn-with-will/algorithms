---
id: lesson-21
slug: minimum-spanning-trees
title: "Minimum Spanning Trees: Kruskal and Prim"
level: advanced
order: 21
duration: 30
tags:
  - mst
  - kruskal
  - prim
  - cut-property
  - graphs
---

# Learning Objectives

By the end of this lesson you will be able to:

- Define a **minimum spanning tree** and its `V − 1`-edge structure.
- State the **cut property** and why it makes greedy MST algorithms correct.
- Implement **Kruskal's** algorithm using union-find.
- Implement **Prim's** algorithm using a min-heap.
- Distinguish an MST from shortest paths, and pick Kruskal vs. Prim.

# Why This Concept Exists

Suppose you must connect a set of towns with roads (or computers with cable, or pins on a
circuit board) using the least total length, with every location reachable. That is the
**minimum spanning tree** problem: find a subset of edges that connects all vertices with the
minimum possible total weight and no cycles. It is one of the oldest and most useful graph
problems — network design, clustering, and approximation algorithms all build on it — and it
is beautifully solved by two different greedy strategies, both justified by a single idea: the
cut property.

# Concept Explanation

### What an MST is

Given a **connected, undirected, weighted** graph, a **spanning tree** is a subset of edges
that connects all `V` vertices with exactly `V − 1` edges and no cycles. The **minimum**
spanning tree is the spanning tree with the smallest total edge weight. (If edge weights are
distinct the MST is unique; with ties there may be several, all of equal total weight.)

### The cut property — why greedy works

A **cut** partitions the vertices into two non-empty sets. An edge **crosses** the cut if its
endpoints are on opposite sides. The **cut property** states:

> For any cut, the minimum-weight edge crossing it belongs to some MST.

Both algorithms are greedy consequences of this: repeatedly pick a safe minimum-weight edge and
add it. The cut property guarantees each such edge is part of an MST, so the greedy result is
optimal.

### Kruskal's algorithm — sort edges, avoid cycles

Kruskal grows a **forest**: sort all edges by weight, then consider them from lightest to
heaviest, adding an edge **only if it connects two different components** (i.e. does not form a
cycle). Cycle detection is exactly what **union-find** (Lesson 22) does in near-constant time.
Sorting dominates, so Kruskal is `O(E log E) = O(E log V)`.

### Prim's algorithm — grow one tree

Prim grows a **single tree** from an arbitrary start vertex. Maintain a min-heap of edges
crossing from the tree to outside vertices; repeatedly take the **minimum-weight crossing
edge**, add its new vertex to the tree, and push that vertex's edges. With a binary heap it is
`O(E log V)`.

Both are greedy, both are optimal, and both cost `O(E log V)` — they differ in *how* they apply
the cut property (Kruskal across the whole graph, Prim across the growing tree's boundary).

# Key Terminology

- **Spanning tree** — connects all `V` vertices with `V − 1` edges, no cycles.
- **Minimum spanning tree (MST)** — spanning tree of least total weight.
- **Cut** — a partition of vertices into two sets; an edge **crosses** it if its ends differ.
- **Cut property** — the lightest edge crossing any cut is in some MST.
- **Union-find** — the disjoint-set structure Kruskal uses to detect cycles.

# Complexity

| Algorithm | Approach | Time | Uses |
| --------- | -------- | ---- | ---- |
| Kruskal | sort edges, add if no cycle | O(E log E) = O(E log V) | union-find |
| Prim (binary heap) | grow tree, take lightest crossing edge | O(E log V) | min-heap |

Both need a connected graph and produce a tree of `V − 1` edges.

# Implementation in Python

```python
# --- Kruskal, using a compact union-find (see Lesson 22) ---
def kruskal(n: int, edges: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
    """n vertices 0..n-1; edges = (weight, u, v). Returns MST edge list."""
    parent = list(range(n))

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]   # path compression (halving)
            x = parent[x]
        return x

    mst = []
    for w, u, v in sorted(edges):           # lightest edges first
        ru, rv = find(u), find(v)
        if ru != rv:                        # different components -> no cycle
            parent[ru] = rv
            mst.append((w, u, v))
    return mst


# --- Prim, using a min-heap ---
import heapq

def prim(graph: dict[int, list[tuple[int, int]]], start: int = 0) -> int:
    """graph[u] = list of (v, weight). Returns total MST weight."""
    visited = {start}
    heap = [(w, v) for v, w in graph[start]]
    heapq.heapify(heap)
    total = 0
    while heap and len(visited) < len(graph):
        w, v = heapq.heappop(heap)
        if v in visited:                    # stale crossing edge -> skip
            continue
        visited.add(v)
        total += w
        for nb, wt in graph[v]:
            if nb not in visited:
                heapq.heappush(heap, (wt, nb))
    return total
```

# Real World Analogy

An MST is the **cheapest way to lay cable so every building has power**. You do not care how
long the path is between any two specific buildings (that is shortest paths) — you care that
*everyone* is connected for the least total cable. Kruskal is a contractor laying the cheapest
available cable segment anywhere, as long as it joins two not-yet-connected clusters. Prim is a
contractor extending one growing network outward, always adding the cheapest cable that reaches
a new building.

# Examples

## Example 1 — Basic: Kruskal builds the MST

```python
edges = [(1, 0, 1), (3, 1, 2), (4, 0, 2), (2, 2, 3), (5, 1, 3)]
kruskal(4, edges)
# [(1, 0, 1), (2, 2, 3), (3, 1, 2)]  -> total weight 6, exactly V-1 = 3 edges
```

**Why this is good:** edges are added lightest-first, skipping any that would close a cycle
(the union-find `find` check). The result has exactly `V − 1 = 3` edges and minimum total
weight — a direct application of the cut property.

## Example 2 — Real-world: Prim grows a network

```python
graph = {
    0: [(1, 1), (2, 4)],
    1: [(0, 1), (2, 3), (3, 5)],
    2: [(0, 4), (1, 3), (3, 2)],
    3: [(1, 5), (2, 2)],
}
prim(graph, 0)   # 6  (edges 0-1, 2-3, 1-2)
```

**Why this is good:** Prim starts at vertex 0 and always extends by the cheapest edge crossing
to a new vertex, using the heap to find that edge quickly. It reaches the same total weight (6)
as Kruskal — different strategy, same optimal MST.

## Example 3 — Best practice / edge case: MST is not shortest paths

```text
Triangle: A-B = 1, B-C = 1, A-C = 3
MST: {A-B, B-C}  (total 2)  -- omits A-C entirely
Shortest A->C path in the MST is 2, but the MST is not built to minimize A->C;
it minimizes TOTAL connection cost. For per-pair shortest routes, use Dijkstra.
```

**Why this is good:** it separates two problems students often conflate. The MST minimizes the
*total* weight to connect everything; shortest-path algorithms minimize the distance between a
specific pair. The MST may not contain the shortest path between two given vertices.

# Common Mistakes

- **Confusing MST with shortest paths.** MST minimizes total tree weight; Dijkstra minimizes
  per-source path distance. They generally differ.
- **Forgetting the cycle check in Kruskal.** Without union-find you would add edges that form
  cycles and no longer have a tree.
- **Assuming a spanning tree exists.** It requires a **connected** graph; a disconnected graph
  has a spanning *forest*, not a single spanning tree.
- **Ignoring stale heap entries in Prim.** A vertex can be pushed multiple times; skip it if it
  is already in the tree.

# Best Practices

- Use **Kruskal** when the graph is sparse or edges are already sorted; use **Prim** when the
  graph is dense or given as adjacency lists.
- Back Kruskal with a proper **union-find** (union by rank + path compression) for near-linear
  cycle checks.
- Confirm the graph is **connected**; otherwise expect a spanning forest.
- Remember the **cut property** — it is the one idea that proves both algorithms correct.

# Summary

- An MST connects all `V` vertices with `V − 1` edges of minimum total weight, no cycles.
- The **cut property** — the lightest edge across any cut is in some MST — makes greedy correct.
- **Kruskal** sorts edges and adds them if they don't form a cycle (union-find), `O(E log V)`.
- **Prim** grows one tree, always taking the lightest crossing edge (min-heap), `O(E log V)`.
- An MST is **not** the same as shortest paths — it minimizes total weight, not pair distances.

# Flash Cards

Q: What does a minimum spanning tree minimize, and how many edges does it have?
A: The total weight of edges connecting all V vertices, using exactly V-1 edges with no cycles.

Q: State the cut property.
A: For any cut of the vertices, the minimum-weight edge crossing the cut belongs to some minimum spanning tree.

Q: What data structure does Kruskal's algorithm use to detect cycles, and what is its running time?
A: Union-find (disjoint sets); Kruskal runs in O(E log E) = O(E log V), dominated by sorting the edges.

Q: How does Prim's algorithm choose the next edge?
A: It takes the minimum-weight edge crossing from the growing tree to a vertex not yet in the tree, using a min-heap.

Q: How is an MST different from shortest paths?
A: An MST minimizes the total weight to connect all vertices; shortest-path algorithms minimize distance between a specific source and other vertices — they generally differ.

Q: What kind of graph is required for a single spanning tree to exist?
A: A connected graph; a disconnected graph yields a spanning forest instead.

# Exercises

### Easy
Given a small weighted graph, run Kruskal by hand: list the edges in sorted order and mark
which are added and which are skipped (cycle). Confirm you end with `V − 1` edges.

### Medium
Modify `prim` to also return the actual MST **edges** (not just the total weight) by recording,
for each newly added vertex, the edge that brought it in.

### Challenging
Prove the cut property by an exchange argument: assume an MST `T` does not contain the minimum
crossing edge `e` of some cut; show that adding `e` and removing another crossing edge from the
cycle it creates yields a spanning tree no heavier than `T`.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 21
  ("Minimum Spanning Trees"): the cut property, Kruskal, and Prim.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 4.3 ("Minimum Spanning Trees").
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Section 8.1 (minimum spanning trees).
