---
slug: negative-cycle-detection
title: "Detecting Negative Weight Cycles"
topic: graph-optimization
kind: technique
summary: "A graph contains a reachable negative-weight cycle if any edge can still be relaxed after |V| - 1 iterations."
tags: ["negative-cycle", "bellman-ford", "arbitrage", "graph-algorithms"]
related: ["bellman-ford-algorithm", "why-dijkstra-fails-on-negative-weights", "single-source-shortest-paths-problem"]
---
> **In one line:** If an edge can still be relaxed on the |V|-th iteration of Bellman-Ford, a negative weight cycle exists.

## The idea

A **negative-weight cycle** is a directed cycle whose edge weights sum to a value strictly less than zero.

If a reachable negative cycle exists on a path to vertex $v$, **no shortest path can exist**: each time you traverse the cycle, the path cost decreases by another negative increment. You could loop infinitely to achieve an unbounded path cost of $-\infty$!

The Bellman-Ford algorithm provides the definitive test for negative cycles:
1. Execute $|V| - 1$ relaxation passes across all edges.
2. Execute a **$|V|$-th relaxation pass**.
3. If **any edge $(u, v)$ can still be relaxed** (`dist[u] + w < dist[v]`), then that edge belongs to or is reachable from a **negative-weight cycle**!

## See it

Detecting and reporting negative weight cycles:

```python
def find_negative_cycle(edges: list[tuple[int, int, float]], num_nodes: int, start: int) -> bool:
    dist = [float('inf')] * num_nodes
    dist[start] = 0.0
    
    # |V| - 1 passes
    for _ in range(num_nodes - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                
    # Check for negative cycle on |V|-th pass
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return True  # Negative cycle detected!
            
    return False

# Negative cycle: 1 -> 2 (w=1), 2 -> 3 (w=-5), 3 -> 1 (w=2) -> sum = -2
cycle_edges = [(0, 1, 1.0), (1, 2, 1.0), (2, 3, -5.0), (3, 1, 2.0)]
print("Has negative cycle:", find_negative_cycle(cycle_edges, 4, 0))  # True
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

Negative cycle detection has a high-value real-world application in financial markets: **currency arbitrage**.

If currency exchange rates allow converting USD $\to$ EUR $\to$ GBP $\to$ USD to end with more money than started, an arbitrage opportunity exists:
$$R_1 \times R_2 \times R_3 > 1$$
Taking the negative logarithm turns multiplication into addition:
$$(-\ln R_1) + (-\ln R_2) + (-\ln R_3) < 0$$
This transforms financial arbitrage directly into finding a negative-weight cycle in an exchange rate graph!

From an algorithmic engineering perspective, understanding the precise operational characteristics of detecting negative weight cycles allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- If a negative cycle is not reachable from the start vertex, a single-source Bellman-Ford will not detect it; initialize all dist to 0 to detect any cycle.
- Shortest paths are undefined for vertices that can reach a negative cycle.

## Remember

- Shortest paths are mathematically undefined in the presence of negative cycles (-infinity).
- An edge relaxing on the |V|-th pass proves the existence of a negative cycle.
- Currency arbitrage is mathematically solved via negative cycle detection on log rates.
