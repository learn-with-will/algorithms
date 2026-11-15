---
slug: kruskals-algorithm-with-union-find
title: "Kruskal's Algorithm and Edge Sorting"
topic: graph-optimization
kind: technique
summary: "Kruskal's algorithm sorts all edges by weight and greedily adds them to the forest using union-find for cycle checks."
tags: ["kruskal", "mst", "union-find", "greedy"]
related: ["minimum-spanning-tree-properties", "prims-algorithm-vertex-expansion", "kruskal-vs-prim-comparison"]
---
> **In one line:** Kruskal's algorithm sorts all edges and greedily adds the lightest edge that does not form a cycle.

## The idea

**Kruskal's algorithm** constructs an MST by growing a forest of trees:

1. Sort all $|E|$ edges in non-decreasing order of weight: $w(e_1) \le w(e_2) \le \dots \le w(e_m)$.
2. Initialize a disjoint-set (Union-Find) with each vertex in its own set.
3. For each edge $e = (u, v)$ in sorted order:
   - If `find(u) != find(v)`: the edge connects two disjoint components without creating a cycle! Add $e$ to the MST and merge sets with `union(u, v)`.
   - If `find(u) == find(v)`: discard the edge (it would create a cycle).
4. Terminate when $|V| - 1$ edges have been added.

```flow
sort: Sort All Edges | O(E log E) @primary
loop: Inspect Lightest Edge | (u, v, w) @blue
check: find(u) != find(v)? | check cycle @amber
add: Add to MST | union(u, v) @green
sort -> loop
loop -> check
check -> add: True
```

Sorting dominates the running time, yielding **$O(E \log E) = O(E \log V)$ time**.

## See it

Complete implementation of Kruskal's algorithm in Python:

```python
def kruskal_mst(num_nodes: int, edges: list[tuple[int, int, float]]) -> list[tuple[int, int, float]]:
    # 1. Sort edges by weight
    sorted_edges = sorted(edges, key=lambda e: e[2])
    
    # 2. Union-Find setup
    parent = list(range(num_nodes))
    def find(i):
        if parent[i] != i: parent[i] = find(parent[i])
        return parent[i]
        
    mst = []
    for u, v, weight in sorted_edges:
        root_u, root_v = find(u), find(v)
        if root_u != root_v:
            mst.append((u, v, weight))
            parent[root_u] = root_v
            if len(mst) == num_nodes - 1:
                break
                
    return mst

graph_edges = [(0, 1, 10.0), (0, 2, 6.0), (0, 3, 5.0), (1, 3, 15.0), (2, 3, 4.0)]
print("MST Edges:", kruskal_mst(4, graph_edges))  # [(2, 3, 4.0), (0, 3, 5.0), (0, 1, 10.0)]
```

## Go deeper

Because $|E| \le |V|^2$, $\log(E) \le 2 \log(V)$. Thus, $O(E \log E)$ is asymptotically equivalent to $O(E \log V)$. 

After sorting edges in $O(E \log E)$ time, the union-find operations take $O(E \cdot \alpha(V))$ time, which is essentially linear. Kruskal's algorithm is especially fast on **sparse graphs** where $|E| \approx |V|$.

From an algorithmic engineering perspective, understanding the precise operational characteristics of kruskal's algorithm and edge sorting allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Sorting edges by weight is the bottleneck; ensure you use an efficient O(E log E) sort.
- Stop early once len(mst) == num_nodes - 1 to avoid inspecting unnecessary remaining edges.

## Remember

- Kruskal's algorithm sorts edges by weight and uses Union-Find to prevent cycles.
- Runs in O(E log V) time, dominated by edge sorting.
- Particularly efficient on sparse graphs where |E| << |V|^2.
