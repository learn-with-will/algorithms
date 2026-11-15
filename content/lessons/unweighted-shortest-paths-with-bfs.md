---
slug: unweighted-shortest-paths-with-bfs
title: "Shortest Paths in Unweighted Graphs"
topic: graph-traversals-and-connectivity
kind: pattern
summary: "BFS guarantees finding the shortest path (minimum edge count) in any unweighted graph."
tags: ["shortest-path", "bfs", "pathfinding", "unweighted"]
related: ["breadth-first-search-bfs", "depth-first-search-dfs", "single-source-shortest-paths-problem"]
---
> **In one line:** BFS finds the shortest path in unweighted graphs by recording parent predecessor pointers.

## The idea

When all edges in a graph have uniform weight (or unit cost of 1), **Breadth-First Search is guaranteed to find the shortest path** between a source and any reachable destination.

To reconstruct the actual route, BFS records two auxiliary structures:
- `dist[v]`: the minimum edge hop distance from start to $v$.
- `parent[v]`: the predecessor node that discovered $v$.

When target $t$ is reached:
1. Distance is retrieved directly from `dist[t]`.
2. The full path is reconstructed by following `parent` pointers backward from $t$ to $s$ and reversing the result.

## See it

Shortest path discovery and route reconstruction with BFS:

```python
from collections import deque

def shortest_path(graph: dict[int, list[int]], start: int, target: int) -> list[int]:
    if start == target: return [start]
    dist, parent = {start: 0}, {start: None}
    queue = deque([start])
    while queue:
        curr = queue.popleft()
        if curr == target: break
        for nbr in graph.get(curr, []):
            if nbr not in dist:
                dist[nbr] = dist[curr] + 1
                parent[nbr] = curr
                queue.append(nbr)
    if target not in parent: return []
    path, step = [], target
    while step is not None:
        path.append(step)
        step = parent[step]
    return path[::-1]

maze = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2, 4], 4: [3]}
print(shortest_path(maze, 0, 4))  # [0, 1, 3, 4]
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

Why does Dijkstra's algorithm reduce to BFS on unweighted graphs?

Dijkstra's algorithm extracts vertices from a priority queue ordered by path distance. When all edge weights equal 1, vertices are naturally discovered in monotonic order of distance ($0, 1, 2, \dots$). 

A standard FIFO queue maintains this ordering automatically, eliminating the $O(\log V)$ priority queue heap overhead and reducing complexity from $O((V + E) \log V)$ to $O(V + E)$.

From an algorithmic engineering perspective, understanding the precise operational characteristics of shortest paths in unweighted graphs allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- BFS only finds shortest paths on UNWEIGHTED graphs; if edges have varying weights, use Dijkstra's algorithm.
- Reconstruct the path backwards from target to start before reversing.

## Remember

- BFS guarantees finding paths with the minimum number of edge hops.
- Track parent pointers during traversal to reconstruct the optimal route.
- Runs in O(V + E) time, vastly faster than Dijkstra on unweighted graphs.
