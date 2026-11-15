---
slug: single-source-shortest-paths-problem
title: "Single-Source Shortest Paths and Edge Relaxation"
topic: graph-optimization
kind: concept
summary: "Shortest path algorithms repeatedly relax edges: if dist[u] + weight(u, v) < dist[v], update dist[v]."
tags: ["shortest-paths", "relaxation", "graphs", "optimization"]
related: ["dijkstras-algorithm-with-min-heap", "bellman-ford-algorithm", "unweighted-shortest-paths-with-bfs"]
---
> **In one line:** Shortest path algorithms optimize path estimates via edge relaxation: tightening distance bounds whenever a shorter path is found.

## The idea

Given a directed, weighted graph $G = (V, E)$ with weight function $w: E \to \mathbb{R}$, the **Single-Source Shortest Paths (SSSP)** problem asks for the path of minimum total weight from a source vertex $s$ to every reachable vertex $v$.

Every shortest path algorithm relies on a single fundamental operation called **edge relaxation**:
For an edge $(u, v)$ with weight $w(u, v)$:
$$\text{if } dist[u] + w(u, v) < dist[v]: \quad dist[v] = dist[u] + w(u, v), \quad parent[v] = u$$

| Concept | Meaning |
|---|---|
| $dist[v]$ | Current best upper bound on the shortest-path distance from $s$ to $v$. |
| $parent[v]$ | Predecessor of $v$ on the current shortest path. |
| **Triangle Inequality** | For any edge $(u, v)$: $\delta(s, v) \le \delta(s, u) + w(u, v)$ must hold at optimality. |

Edge relaxation tightens $dist[v]$ monotonically downward until all bounds converge to the exact shortest-path distances $\delta(s, v)$.

## See it

Edge relaxation step in Python:

```python
def relax(u: int, v: int, weight: float, dist: dict, parent: dict) -> bool:
    """Relax edge (u, v) with weight. Returns True if distance improved."""
    if dist[u] + weight < dist[v]:
        dist[v] = dist[u] + weight
        parent[v] = u
        return True
    return False

# Initialize single-source
nodes = [0, 1, 2]
dist = {node: float('inf') for node in nodes}
parent = {node: None for node in nodes}
dist[0] = 0  # Distance to source is 0

# Relax edge (0 -> 1) with weight 4.0
relax(0, 1, 4.0, dist, parent)
print("dist[1] after relaxation:", dist[1])  # 4.0
```

## Go deeper

The **optimal substructure property** applies to shortest paths: any subpath of a shortest path is itself a shortest path. 

If path $p = \langle s, \dots, u, v \rangle$ is a shortest path from $s$ to $v$, then the prefix path from $s$ to $u$ must be a shortest path from $s$ to $u$. Algorithms differ solely in the order and number of times they relax edges:
- **Dijkstra:** Relaxes edges out of the closest unvisited vertex (greedy).
- **Bellman-Ford:** Relaxes all $|E|$ edges $|V|-1$ times (dynamic programming).

From an algorithmic engineering perspective, understanding the precise operational characteristics of single-source shortest paths and edge relaxation allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Initializing dist[s] to 0 is mandatory; if all distances remain infinity, relaxation never triggers.
- Edge relaxation strictly decreases distance bounds; dist[v] never increases during valid executions.

## Remember

- The relaxation operation updates dist[v] whenever a shorter path via u is discovered.
- Subpaths of shortest paths are themselves shortest paths (optimal substructure).
- Dijkstra and Bellman-Ford differ primarily in their edge relaxation ordering.
