---
slug: depth-first-search-dfs
title: "Depth-First Search (DFS)"
topic: graph-traversals-and-connectivity
kind: technique
summary: "Explore deeply along graph branches using recursion or an explicit LIFO stack before backtracking."
tags: ["dfs", "depth-first-search", "graph-traversal", "recursion"]
related: ["breadth-first-search-bfs", "cycle-detection-and-connectivity", "backtracking-search-state-space"]
---
> **In one line:** Depth-First Search plunges deep down a branch until hitting dead ends before backtracking.

## The idea

**Depth-First Search (DFS)** explores a graph by following a path as deeply as possible along edge connections before backtracking:

Starting from vertex $u$:
1. Mark $u$ as visited.
2. For each unvisited neighbor $v$ of $u$: recursively invoke DFS on $v$.
3. When all outgoing edges of $u$ have been explored, backtrack to the predecessor.

```flow
u: Vertex U | start exploration @primary
v: Neighbor V | dive deeper recursively @blue
w: Dead End W | no unvisited neighbors @amber
bt: Backtrack | return to parent U @green
u -> v
v -> w
w -> bt
```

DFS partitions graph edges into **tree edges** (discovering new vertices) and **back edges** (pointing to ancestors, revealing cycles). Runs in strictly **$O(V + E)$ time**.

## See it

Recursive and iterative DFS in Python:

```python
# Recursive DFS
def dfs_recursive(graph: dict[int, list[int]], u: int, visited: set[int]) -> None:
    visited.add(u)
    print(u, end=" ")
    for v in graph.get(u, []):
        if v not in visited:
            dfs_recursive(graph, v, visited)

# Iterative DFS with an explicit stack (immune to recursion limits)
def dfs_iterative(graph: dict[int, list[int]], start: int) -> list[int]:
    visited = set()
    stack = [start]
    order = []
    while stack:
        u = stack.pop()
        if u not in visited:
            visited.add(u)
            order.append(u)
            for v in reversed(graph.get(u, [])):
                if v not in visited:
                    stack.append(v)
    return order
```

## Go deeper

DFS forms the algorithmic core of advanced graph theorems:
- **Topological Sorting:** Sorting vertices of a Directed Acyclic Graph (DAG) by reverse post-visit completion time.
- **Strongly Connected Components (SCC):** Kosaraju's and Tarjan's algorithms both rely on DFS discovery and finish timestamps.
- **Biconnected Components:** Finding articulation points and bridges (critical single-point failure edges) in communication networks.

From an algorithmic engineering perspective, understanding the precise operational characteristics of depth-first search (dfs) allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Recursive DFS on large, deep graphs risks RecursionError in Python; use an iterative stack for deep graphs.
- DFS does NOT find the shortest path in graphs; it finds any path.

## Remember

- DFS explores as deeply as possible along graph branches before backtracking.
- Runs in linear O(V + E) time.
- Underpins topological sorting, cycle detection, and strongly connected components.
