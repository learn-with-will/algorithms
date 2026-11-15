---
slug: breadth-first-search-bfs
title: "Breadth-First Search (BFS)"
topic: graph-traversals-and-connectivity
kind: technique
summary: "Explore graphs level by level from a source vertex using a FIFO queue and a visited tracking set."
tags: ["bfs", "breadth-first-search", "graph-traversal", "queue"]
related: ["adjacency-matrix-vs-adjacency-list", "unweighted-shortest-paths-with-bfs", "depth-first-search-dfs"]
---
> **In one line:** Breadth-First Search explores vertices in increasing order of distance from the source using a FIFO queue.

## The idea

**Breadth-First Search (BFS)** is the foundational algorithm for traversing or searching graphs level by level.

Starting from a source vertex $s$:
1. Mark $s$ as visited and enqueue it into a FIFO queue.
2. While the queue is not empty:
   - Dequeue the front vertex $u$.
   - For every unvisited neighbor $v$ of $u$: mark $v$ as visited and enqueue $v$.

```flow
s: Source Node (Level 0) | enqueue start vertex @primary
l1: Level 1 Neighbors | distance = 1 hop @blue
l2: Level 2 Neighbors | distance = 2 hops @amber
l3: Level 3 Neighbors | distance = 3 hops @green
s -> l1
l1 -> l2
l2 -> l3
```

Because every vertex is enqueued at most once and every edge is traversed once (or twice in undirected graphs), BFS runs in strictly **$O(V + E)$ linear time**.

## See it

Canonical BFS implementation using collections.deque:

```python
from collections import deque

def bfs(graph: dict[int, list[int]], start: int) -> list[int]:
    visited = {start}
    queue = deque([start])
    order = []
    
    while queue:
        u = queue.popleft()
        order.append(u)
        
        for v in graph.get(u, []):
            if v not in visited:
                visited.add(v)
                queue.append(v)
                
    return order

network = {0: [1, 2], 1: [0, 3], 2: [0, 4], 3: [1], 4: [2]}
print("BFS Traversal Order:", bfs(network, 0))  # [0, 1, 2, 3, 4]
```

## Go deeper

A vital invariant of BFS: when a vertex at distance $d$ is being processed, the queue contains vertices at distance $d$ or $d + 1$, and nothing else.

This monotonicity guarantees that the first time BFS discovers a vertex $v$, the discovery path contains the **absolute minimum number of edges** from the source, making BFS the optimal algorithm for unweighted shortest paths.

From an algorithmic engineering perspective, understanding the precise operational characteristics of breadth-first search (bfs) allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Always mark a neighbor as visited IMMEDIATELY when enqueuing it; delaying until dequeue causes identical vertices to be enqueued repeatedly, collapsing performance.
- Do not use list.pop(0) for the queue; use collections.deque.popleft().

## Remember

- BFS explores graph vertices level-by-level in order of edge distance.
- Uses a FIFO queue (collections.deque) and a visited set.
- Runs in optimal linear O(V + E) time.
