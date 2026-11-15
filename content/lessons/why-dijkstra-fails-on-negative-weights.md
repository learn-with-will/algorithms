---
slug: why-dijkstra-fails-on-negative-weights
title: "Why Dijkstra Fails on Negative Edge Weights"
topic: graph-optimization
kind: pitfall
summary: "Dijkstra assumes settled vertex distances are final; negative edges allow later paths to be shorter, breaking correctness."
tags: ["dijkstra", "negative-weights", "pitfalls", "counterexample"]
related: ["dijkstras-algorithm-with-min-heap", "bellman-ford-algorithm", "negative-cycle-detection"]
---
> **In one line:** Dijkstra assumes settled distances never decrease; negative edge weights shatter this greedy invariant.

## The idea

Why can't Dijkstra's algorithm handle negative edge weights?

Dijkstra's correctness relies on a **greedy invariant**: when a vertex $u$ is extracted from the min-heap, its tentative distance `dist[u]` is assumed to be **final and optimal**. Because all edges are non-negative, taking any longer path through other vertices can only *increase* the total distance.

> **Watch out:** When **negative edge weights** exist, a path that starts out with higher cost can later become much cheaper by taking a large negative edge. Dijkstra will have already marked the destination as "settled", missing the true shortest path!

## See it

Minimal 3-node counterexample where Dijkstra fails:

```python
# Graph:
# Source A (0): A -> B (weight 3), A -> C (weight 5)
# Intermediate: C -> B (weight -10)
# True shortest path A -> B is A -> C -> B (cost: 5 - 10 = -5)

graph = {
    'A': [('B', 3.0), ('C', 5.0)],
    'C': [('B', -10.0)],
    'B': []
}

# Dijkstra steps:
# 1. Start at A: dist[A]=0, dist[B]=3, dist[C]=5
# 2. Extract B (d=3) -> MARKS B AS SETTLED!
# 3. Extract C (d=5) -> sees edge to B with weight -10 -> 5 + (-10) = -5
# In standard Dijkstra with a visited set, B is already settled and ignored!
# Dijkstra reports dist[B] = 3 instead of the true optimal -5!
```

## Go deeper

Can we fix Dijkstra by simply adding a constant positive offset $C$ to all edge weights to make them non-negative?

**No!** Adding $C$ to every edge penalizes paths with *more edges* more severely than paths with fewer edges. A path with 3 edges has $3C$ added to its cost, while a path with 1 edge has only $C$ added, changing which path is minimal! 

For graphs with negative edges, you must use the **Bellman-Ford algorithm**.

From an algorithmic engineering perspective, understanding the precise operational characteristics of why dijkstra fails on negative edge weights allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Never attempt to 'fix' negative weights by adding a constant offset to all edges; it alters the optimal shortest path.
- Use Bellman-Ford or Johnson's algorithm when negative edges may be present.

## Remember

- Dijkstra assumes extracted distances are permanent and optimal.
- Negative edge weights violate this greedy monotonicity assumption.
- Adding constant offsets to edge weights distorts path comparisons.
