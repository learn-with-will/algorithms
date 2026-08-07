---
id: lesson-20
slug: shortest-paths
title: "Shortest Paths: Dijkstra and Bellman-Ford"
level: advanced
order: 20
duration: 34
tags:
  - shortest-paths
  - dijkstra
  - bellman-ford
  - graphs
  - weighted
---

# Learning Objectives

By the end of this lesson you will be able to:

- Define the **single-source shortest-path** problem on a weighted graph.
- Explain **edge relaxation**, the operation both algorithms share.
- Implement **Dijkstra's algorithm** with a heap and state its `O(E log V)` cost.
- Implement **Bellman-Ford**, handle negative edges, and detect **negative cycles**.
- Choose the right algorithm based on whether edge weights can be negative.

# Why This Concept Exists

BFS finds shortest paths when every edge counts the same, but real networks have **weights** —
road distances, network latencies, transfer costs. The **single-source shortest-path** problem
asks for the least-total-weight route from one source to every other vertex. Two algorithms
dominate: **Dijkstra**, a fast greedy method for non-negative weights, and **Bellman-Ford**,
slower but able to handle negative weights and detect negative cycles. They power GPS routing,
network protocols, and currency-arbitrage detection.

# Concept Explanation

### Relaxation: the shared core

Both algorithms keep a tentative distance `dist[v]` to every vertex, initialized to `∞`
(`0` for the source), and repeatedly **relax** edges:

```text
relax(u, v, w):  if dist[u] + w < dist[v]:  dist[v] = dist[u] + w   (found a shorter route)
```

Shortest-path algorithms differ only in **the order** in which they relax edges and how many
times. Relaxation never makes a distance wrong — it only ever improves it toward the true
shortest distance.

### Dijkstra's algorithm (non-negative weights)

Dijkstra is **greedy**. Keep a min-priority queue of vertices by tentative distance. Repeatedly
**extract the closest** not-yet-finalized vertex, finalize it, and relax its outgoing edges. A
finalized vertex's distance is final — which is *only* valid when weights are **non-negative**,
because a later path through farther vertices can never beat one already found. With a binary
heap it runs in `O((V + E) log V)`, usually written `O(E log V)`.

A negative edge breaks Dijkstra: it could make an already-finalized vertex reachable more
cheaply, but Dijkstra never revisits it.

### Bellman-Ford (negative weights, cycle detection)

Bellman-Ford makes no greedy assumption. It simply relaxes **every edge**, `V − 1` times.
After `V − 1` rounds all shortest paths (which have at most `V − 1` edges) are found. It runs
in `O(V · E)` — slower than Dijkstra, but it tolerates negative edges. One more round detects a
**negative cycle**: if any edge can *still* be relaxed, a negative-weight cycle is reachable and
no shortest path is well-defined (you could loop forever getting cheaper).

# Key Terminology

- **Single-source shortest path** — least-weight paths from one source to all vertices.
- **Relaxation** — `dist[v] = min(dist[v], dist[u] + w(u,v))`.
- **Finalize** — fix a vertex's distance as final (Dijkstra, once extracted).
- **Negative cycle** — a cycle whose edge weights sum to < 0; makes shortest paths undefined.
- **Non-negative weights** — Dijkstra's precondition.

# Complexity

| Algorithm | Weights | Time | Detects negative cycle? |
| --------- | ------- | ---- | ----------------------- |
| Dijkstra (binary heap) | non-negative only | O((V + E) log V) | No |
| Bellman-Ford | any (incl. negative) | O(V · E) | Yes |

# Implementation in Python

```python
import heapq

def dijkstra(graph: dict[int, list[tuple[int, int]]], source: int) -> dict[int, float]:
    """graph[u] = list of (v, weight); weights must be non-negative."""
    dist = {u: float("inf") for u in graph}
    dist[source] = 0
    pq = [(0, source)]                       # (distance, vertex)
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:                      # stale entry (lazy deletion) -> skip
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:        # relax
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist


def bellman_ford(vertices, edges, source):
    """edges = list of (u, v, w). Returns (dist, has_negative_cycle)."""
    dist = {v: float("inf") for v in vertices}
    dist[source] = 0
    for _ in range(len(vertices) - 1):       # V-1 rounds
        for u, v, w in edges:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    # One more pass: any further relaxation means a negative cycle.
    for u, v, w in edges:
        if dist[u] != float("inf") and dist[u] + w < dist[v]:
            return dist, True
    return dist, False
```

# Real World Analogy

Dijkstra is a **flood spreading from a source** across a landscape of pipes of different
lengths: water reaches the nearest junctions first, and once it arrives somewhere by the
shortest pipe, that arrival time is settled. This works only when every pipe adds distance
(non-negative weights). Bellman-Ford is more like patiently re-checking *every* road again and
again until no route improves — slower, but it copes with strange "shortcuts" (negative edges)
and notices if you could loop forever getting closer (a negative cycle).

# Examples

## Example 1 — Basic: Dijkstra on a small graph

```python
graph = {
    0: [(1, 4), (2, 1)],
    1: [(3, 1)],
    2: [(1, 2), (3, 5)],
    3: [],
}
dijkstra(graph, 0)    # {0: 0, 1: 3, 2: 1, 3: 4}
```

**Why this is good:** the shortest route to vertex 1 is `0→2→1` (cost 3), not the direct edge
`0→1` (cost 4). Dijkstra finds it by always expanding the closest vertex first, and the
lazy-deletion `if d > dist[u]` guard cleanly handles stale heap entries.

## Example 2 — Real-world: detecting a negative cycle

```python
verts = [0, 1, 2]
edges = [(0, 1, 1), (1, 2, -1), (2, 0, -1)]   # cycle 0->1->2->0 sums to -1
dist, neg = bellman_ford(verts, edges, 0)
# neg == True: no shortest path is well-defined
```

**Why this is good:** the extra relaxation pass catches the negative cycle that Dijkstra could
never handle. Negative-cycle detection is used in practice to find **arbitrage** opportunities
in currency-exchange graphs (a cycle of trades that ends with more money).

## Example 3 — Best practice / edge case: why Dijkstra fails on negative edges

```text
      A --(1)--> B
      A --(4)--> C
      B --(-3)-> C
Dijkstra from A: finalizes C at 4 (via A->C) before seeing B->C = 1 + (-3) = -2.
It never revises C, so it reports 4 -- WRONG (true shortest is -2).
```

**Why this is good:** it is a minimal counterexample showing exactly why Dijkstra's "finalize
once" greed is invalid with negative edges. When weights can be negative, you must use
Bellman-Ford.

# Common Mistakes

- **Running Dijkstra with negative edge weights.** Its correctness depends on non-negativity;
  use Bellman-Ford instead.
- **Skipping the stale-entry check.** With a binary heap you may push a vertex multiple times;
  skip an entry whose stored distance exceeds the current best (`if d > dist[u]: continue`).
- **Forgetting negative-cycle detection.** Without the extra pass, Bellman-Ford returns
  meaningless distances on graphs with negative cycles.
- **Confusing shortest paths with minimum spanning trees.** They optimize different things
  (path distance vs. total tree weight) — see the next lesson.

# Best Practices

- Use **Dijkstra** when all weights are non-negative (the common case) — it is far faster.
- Use **Bellman-Ford** when negative weights are possible or you must detect negative cycles.
- Back a Dijkstra priority queue with `heapq` and use lazy deletion; store predecessors if you
  need the actual paths, not just distances.
- Verify the weight assumption before choosing — it is the single decision that matters here.

# Summary

- The single-source shortest-path problem seeks least-weight routes from one source to all vertices.
- Both algorithms rely on **relaxation**; they differ in edge order and repetition.
- **Dijkstra** is greedy, needs non-negative weights, and runs in `O(E log V)` with a heap.
- **Bellman-Ford** handles negative weights in `O(V·E)` and detects negative cycles.
- Negative edges break Dijkstra; a negative cycle makes shortest paths undefined.

# Flash Cards

Q: What precondition does Dijkstra's algorithm require?
A: All edge weights must be non-negative; otherwise its "finalize once" greedy step is invalid.

Q: What is edge relaxation?
A: Updating dist[v] to dist[u] + w(u,v) whenever that is smaller — the core step of both shortest-path algorithms.

Q: Which shortest-path algorithm can detect a negative cycle, and how?
A: Bellman-Ford — after V-1 relaxation rounds, if any edge can still be relaxed, a reachable negative cycle exists.

Q: What are the running times of Dijkstra (binary heap) and Bellman-Ford?
A: Dijkstra is O((V+E) log V) ≈ O(E log V); Bellman-Ford is O(V·E).

Q: Why does Dijkstra give a wrong answer with a negative edge?
A: It finalizes a vertex's distance when first extracted and never revisits it, so a later cheaper path through a negative edge is missed.

Q: What does a negative cycle imply for shortest paths?
A: No shortest path is well-defined — you can keep looping the cycle to reduce the cost without bound.

# Exercises

### Easy
Run Dijkstra by hand on a 4-vertex weighted graph and list the order in which vertices are
finalized. Confirm each is finalized in nondecreasing distance order.

### Medium
Extend `dijkstra` to also return the **actual shortest path** to a target vertex by recording a
`prev` predecessor for each relaxed vertex and reconstructing backward from the target.

### Challenging
Explain why Bellman-Ford needs exactly `V − 1` relaxation rounds (and no more) to find all
shortest paths in a graph with no negative cycle. What property of a shortest path bounds its
number of edges?

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 22
  ("Single-Source Shortest Paths"): Bellman-Ford and Dijkstra with proofs.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 4.4 ("Shortest Paths").
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Section 8.3.1 (Dijkstra) and weighted graphs.
