---
slug: prims-algorithm-vertex-expansion
title: "Prim's Algorithm and Growing Trees"
topic: graph-optimization
kind: technique
summary: "Prim's algorithm grows a single tree from an arbitrary start vertex by greedily adding the lightest boundary edge."
tags: ["prim", "mst", "priority-queue", "greedy"]
related: ["minimum-spanning-tree-properties", "kruskals-algorithm-with-union-find", "kruskal-vs-prim-comparison"]
---
> **In one line:** Prim's algorithm grows a single minimum spanning tree by repeatedly adding the lightest edge crossing the tree boundary.

## The idea

Unlike Kruskal's algorithm (which merges disconnected forests), **Prim's algorithm** maintains a single connected tree that grows one vertex at a time:

1. Pick an arbitrary starting vertex $s$ and add it to the tree: $S = \{s\}$.
2. Insert all edges incident to $s$ into a min-heap priority queue.
3. While the tree contains fewer than $|V|$ vertices:
   - Extract the lightest edge $(u, v)$ crossing the cut from $S$ to $V - S$.
   - If $v$ is already in the tree: discard.
   - If $v$ is not in the tree: add edge $(u, v)$ to the MST, add $v$ to $S$, and push all edges incident to $v$ into the priority queue.

Using a binary min-heap, Prim's algorithm runs in **$O(E \log V)$ time**.

## See it

Prim's algorithm implementation in Python:

```python
import heapq

def prim_mst(graph: dict[int, list[tuple[int, float]]], start: int = 0):
    visited, mst = set(), []
    pq = [(0.0, start, start)]
    while pq and len(visited) < len(graph):
        weight, u, v = heapq.heappop(pq)
        if v in visited: continue
        visited.add(v)
        if u != v: mst.append((u, v, weight))
        for nxt, w in graph.get(v, []):
            if nxt not in visited:
                heapq.heappush(pq, (w, v, nxt))
    return mst

adj = {
    0: [(1, 10.0), (2, 6.0), (3, 5.0)],
    1: [(0, 10.0), (3, 15.0)],
    2: [(0, 6.0), (3, 4.0)],
    3: [(0, 5.0), (1, 15.0), (2, 4.0)]
}
print(prim_mst(adj, 0))
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

Notice the strong structural resemblance between Prim's algorithm and Dijkstra's algorithm!
- Both maintain a set of visited vertices and extract the minimum item from a priority queue.
- **Dijkstra** orders the heap by total cumulative distance from source: `dist[u] + weight`.
- **Prim** orders the heap strictly by **individual edge weight** crossing the cut.

On dense graphs where $|E| = \Theta(V^2)$, Prim implemented with an adjacency matrix (no heap) runs in $O(V^2)$ time, which beats Kruskal's $O(V^2 \log V)$.

From an algorithmic engineering perspective, understanding the precise operational characteristics of prim's algorithm and growing trees allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Prim requires an undirected connected graph; if the graph has multiple components, it only finds the MST of the start vertex's component.
- Do not confuse Prim's edge-weight priority with Dijkstra's cumulative path distance.

## Remember

- Prim's algorithm grows a single connected tree one vertex at a time.
- Greedily adds the lightest edge crossing the tree cut boundary.
- Runs in O(E log V) time with a heap, or O(V^2) with an adjacency matrix.
