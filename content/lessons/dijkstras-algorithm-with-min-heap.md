---
slug: dijkstras-algorithm-with-min-heap
title: "Dijkstra's Algorithm with a Min-Heap"
topic: graph-optimization
kind: technique
summary: "Compute shortest paths from a source in O((V + E) log V) time by greedily extracting the closest unvisited vertex."
tags: ["dijkstra", "shortest-path", "min-heap", "greedy"]
related: ["single-source-shortest-paths-problem", "why-dijkstra-fails-on-negative-weights", "heapsort-and-heapq-module"]
---
> **In one line:** Dijkstra's algorithm greedily extracts the closest unvisited vertex from a min-heap in O((V + E) log V) time.

## The idea

Invented by Edsger Dijkstra in 1956, **Dijkstra's algorithm** solves single-source shortest paths on graphs with **non-negative edge weights**.

It maintains a set of settled vertices whose shortest distances are finalized:
1. Initialize `dist[s] = 0` and all other distances to $\infty$. Push `(0, s)` to a min-heap.
2. While the heap is not empty:
   - Extract the vertex $u$ with the minimum tentative distance `d`.
   - If `d > dist[u]`, skip (stale heap entry).
   - For each outgoing edge $(u, v)$ with weight $w$:
     - If `dist[u] + w < dist[v]`, relax the edge and push `(dist[v], v)` to the heap.

```flow
init: Min-Heap with (0, source) | dist[source] = 0 @primary
pop: Extract Min Vertex U | finalized distance d @blue
relax: Relax All Neighbors V | dist[u] + w < dist[v] @amber
push: Push (dist[v], v) to Heap | update estimate @green
init -> pop
pop -> relax
relax -> push
```

Using a binary min-heap, Dijkstra runs in **$O((V + E) \log V)$ time**.

## See it

Complete implementation of Dijkstra's algorithm in Python:

```python
import heapq

def dijkstra(graph: dict[int, list[tuple[int, float]]], start: int) -> dict[int, float]:
    dist = {start: 0.0}
    pq = [(0.0, start)]  # (distance, vertex)
    
    while pq:
        d, u = heapq.heappop(pq)
        
        # Skip stale entries from earlier pushes
        if d > dist.get(u, float('inf')):
            continue
            
        for v, weight in graph.get(u, []):
            new_dist = d + weight
            if new_dist < dist.get(v, float('inf')):
                dist[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
                
    return dist

# Graph: 0 -> 1 (w=4), 0 -> 2 (w=1), 2 -> 1 (w=2)
adj = {0: [(1, 4.0), (2, 1.0)], 1: [], 2: [(1, 2.0)]}
print("Shortest distances:", dijkstra(adj, 0))  # {0: 0.0, 2: 1.0, 1: 3.0}
```

## Go deeper

Because Python's `heapq` does not support an $O(\log V)$ `decrease_key` operation, standard Python implementations push a new `(new_dist, v)` tuple to the heap on every successful relaxation.

This adds at most $|E|$ entries to the heap, yielding a heap size of $O(E)$. Because $\log(E) \le 2 \log(V)$, the asymptotic complexity remains strictly $O((V + E) \log V)$.

From an algorithmic engineering perspective, understanding the precise operational characteristics of dijkstra's algorithm with a min-heap allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Dijkstra REQUIRES non-negative edge weights (w >= 0); it fails catastrophically on graphs with negative weights.
- Always include the if d > dist[u]: continue check to discard stale heap entries.

## Remember

- Dijkstra finds shortest paths in O((V + E) log V) time using a min-heap.
- Requires all edge weights to be non-negative.
- Greedily finalizes the closest unvisited vertex on each step.
