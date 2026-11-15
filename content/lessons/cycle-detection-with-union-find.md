---
slug: cycle-detection-with-union-find
title: "Cycle Detection in Undirected Graphs"
topic: graph-traversals-and-connectivity
kind: pattern
summary: "Detect cycles in undirected graphs in O(E * alpha(V)) time by checking if edge endpoints share the same root."
tags: ["cycle-detection", "union-find", "kruskal", "graph-algorithms"]
related: ["disjoint-set-union-find-structure", "cycle-detection-and-connectivity", "kruskals-algorithm-with-union-find"]
---
> **In one line:** Detect cycles in undirected graphs by checking whether edge endpoints already belong to the same set.

## The idea

Union-find provides an elegant, non-recursive algorithm to detect cycles in an **undirected graph**:

Initialize a disjoint set where each vertex is in its own set. For every edge $(u, v)$ in the graph:
1. Find the canonical roots of $u$ and $v$: `root_u = find(u)` and `root_v = find(v)`.
2. **If `root_u == root_v`:** $u$ and $v$ are already connected through an existing path! Adding edge $(u, v)$ creates a **cycle**!
3. **If `root_u != root_v`:** Merge the sets with `union(root_u, root_v)` and proceed.

```flow
e: Inspect Edge (u, v) | from graph edge list @primary
find: find(u) == find(v)? | check connectivity @blue
cycle: Cycle Detected! | edge closes loop @red
merge: union(u, v) | connect components @green
e -> find
find -> cycle: True
find -> merge: False
```

Total running time is **$O(E \cdot \alpha(V))$**, essentially linear in edge count.

## See it

Cycle detection on an edge list in Python:

```python
def has_cycle_undirected(edges: list[tuple[int, int]], num_nodes: int) -> bool:
    dsu = DSU(num_nodes)
    for u, v in edges:
        # If both vertices already share a root, adding (u, v) closes a cycle
        if dsu.find(u) == dsu.find(v):
            return True
        dsu.union(u, v)
    return False

# Graph with cycle: triangle 0-1-2-0
cyclic_edges = [(0, 1), (1, 2), (2, 0)]
print("Has cycle:", has_cycle_undirected(cyclic_edges, 3))  # True

# Acyclic tree: 0-1 and 1-2
tree_edges = [(0, 1), (1, 2)]
print("Has cycle:", has_cycle_undirected(tree_edges, 3))    # False
```

## Go deeper

This cycle detection pattern is the exact algorithmic engine powering **Kruskal's Minimum Spanning Tree algorithm**.

Kruskal inspects edges in increasing order of weight, adding an edge to the growing spanning forest if and only if it does not introduce a cycle (`find(u) != find(v)`).

From an algorithmic engineering perspective, understanding the precise operational characteristics of cycle detection in undirected graphs allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Union-find cycle detection works ONLY on undirected graphs; it cannot detect cycles in directed graphs.
- For directed graph cycle detection, use three-color DFS or Kahn's topological sort.

## Remember

- An undirected cycle exists if an edge connects two vertices with identical find() roots.
- Runs in near-linear O(E * alpha(V)) time without recursion.
- Forms the core verification subroutine inside Kruskal's MST algorithm.
