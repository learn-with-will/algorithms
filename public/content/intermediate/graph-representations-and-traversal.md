---
id: lesson-15
slug: graph-representations-and-traversal
title: "Graph Representations and Traversal (BFS & DFS)"
level: intermediate
order: 15
duration: 32
tags:
  - graphs
  - bfs
  - dfs
  - adjacency-list
  - traversal
---

# Learning Objectives

By the end of this lesson you will be able to:

- Model a problem as a **graph** of vertices and edges (directed/undirected, weighted/not).
- Choose between an **adjacency list** and an **adjacency matrix** and state their costs.
- Implement **breadth-first search (BFS)** and **depth-first search (DFS)**, both `O(V+E)`.
- Use BFS to find shortest paths in an **unweighted** graph.
- Avoid the classic traversal bug: revisiting nodes in a cyclic graph.

# Why This Concept Exists

An astonishing range of problems are really about **relationships**: cities connected by
roads, people connected by friendships, tasks connected by dependencies, web pages connected
by links. A **graph** is the universal model for "things and the connections between them",
and **traversal** — systematically visiting every reachable vertex — is the foundation for
answering questions about them: Is B reachable from A? What is the shortest route? Is there a
cycle? In what order can I schedule these tasks? BFS and DFS are the two traversals every
other graph algorithm builds on.

# Concept Explanation

### Graphs: the vocabulary

A **graph** `G = (V, E)` is a set of **vertices** `V` and **edges** `E` connecting pairs of
them. Edges may be:

- **Directed** (one-way, `a → b`) or **undirected** (two-way, `a — b`).
- **Weighted** (each edge has a cost) or **unweighted**.

### Two representations

- **Adjacency list** — for each vertex, a list of its neighbors. Space is `O(V + E)`, and
  iterating a vertex's neighbors costs `O(degree)`. Best for **sparse** graphs (most real
  ones), and what we use by default.
- **Adjacency matrix** — a `V × V` grid where entry `[u][v]` marks (or weights) the edge.
  Edge lookup is `O(1)`, but space is `O(V²)` regardless of how few edges exist. Best for
  **dense** graphs or when you constantly test "is there an edge u→v?".

```text
graph:  A - B      adjacency list:            adjacency matrix (A B C D):
        |   |        A: [B, C]                     A B C D
        C - D        B: [A, D]                   A[0 1 1 0]
                     C: [A, D]                   B[1 0 0 1]
                     D: [B, C]                   C[1 0 0 1]
                                                 D[0 1 1 0]
```

### Breadth-first search (BFS)

BFS explores the graph in **layers**: the source, then all its neighbors, then their
neighbors, and so on. It uses a **queue** and a **visited** set. Because it reaches vertices
in nondecreasing order of edge-distance from the source, BFS finds the **shortest path in an
unweighted graph**. It runs in `O(V + E)` with an adjacency list.

### Depth-first search (DFS)

DFS explores as **deep** as possible along each branch before backtracking. It uses a
**stack** — often the call stack via recursion. It underlies cycle detection, topological
sorting, connected components, and path finding. Also `O(V + E)` with an adjacency list.

### Marking visited — the crucial detail

Graphs can have **cycles**, so a traversal that does not remember where it has been will
loop forever. Both BFS and DFS keep a **visited** set. For BFS specifically, mark a vertex
visited **when you enqueue it** (not when you dequeue it), so you never enqueue the same
vertex twice.

# Key Terminology

- **Vertex / edge** — a node / a connection between two nodes.
- **Directed / undirected, weighted / unweighted** — edge direction and cost.
- **Adjacency list / matrix** — `O(V+E)`-space neighbor lists / `O(V²)`-space grid.
- **BFS / DFS** — layer-by-layer (queue) / deep-first (stack) traversal.
- **Visited set** — records explored vertices to prevent infinite loops on cycles.

# Complexity

| Traversal | Adjacency list | Adjacency matrix |
| --------- | -------------- | ---------------- |
| BFS | O(V + E) | O(V²) |
| DFS | O(V + E) | O(V²) |

| Representation | Space | Edge lookup | Best for |
| -------------- | ----- | ----------- | -------- |
| Adjacency list | O(V + E) | O(degree) | sparse graphs |
| Adjacency matrix | O(V²) | O(1) | dense graphs |

# Implementation in Python

```python
from collections import deque

Graph = dict[str, list[str]]

def bfs(graph: Graph, start: str) -> list[str]:
    visited = {start}                 # mark on ENQUEUE
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()        # FIFO -> layer by layer
        order.append(node)
        for nbr in graph[node]:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)
    return order

def dfs(graph: Graph, start: str) -> list[str]:
    visited: set[str] = set()
    order: list[str] = []
    def visit(node: str) -> None:
        visited.add(node)
        order.append(node)
        for nbr in graph[node]:
            if nbr not in visited:
                visit(nbr)            # recursion = the stack
    visit(start)
    return order
```

# Real World Analogy

**BFS** is a stone dropped in a pond: ripples spread outward one ring at a time, reaching
everything at distance 1 before distance 2 — which is why the first time a ripple touches a
point is along the shortest route. **DFS** is exploring a hedge maze by always taking the
next unexplored corridor to its dead end, then backtracking to the last junction and trying
another — going deep before wide.

# Examples

## Example 1 — Basic: BFS order

```python
graph = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C"]}
bfs(graph, "A")    # ['A', 'B', 'C', 'D']  -- A, then its neighbors, then theirs
```

**Why this is good:** the output shows the defining behaviour — vertices appear in order of
distance from `A`. The `visited` set makes the cyclic graph (A-B-D-C-A) terminate cleanly.

## Example 2 — Real-world: shortest path in an unweighted graph

```python
from collections import deque

def shortest_path(graph, start, goal):
    if start == goal:
        return [start]
    visited = {start}
    queue = deque([(start, [start])])     # (node, path-so-far)
    while queue:
        node, path = queue.popleft()
        for nbr in graph[node]:
            if nbr not in visited:
                if nbr == goal:
                    return path + [nbr]    # first time reached = shortest
                visited.add(nbr)
                queue.append((nbr, path + [nbr]))
    return None                            # unreachable
```

**Why this is good:** BFS reaches `goal` first along a fewest-edges path, so the moment it is
found the path is guaranteed shortest — no weights, no priority queue needed. (Weighted
shortest paths need Dijkstra, Lesson 20.)

## Example 3 — Best practice / edge case: iterative DFS for deep graphs

```python
def dfs_iterative(graph, start):
    visited, order = set(), []
    stack = [start]
    while stack:
        node = stack.pop()          # LIFO -> depth first
        if node in visited:
            continue
        visited.add(node)
        order.append(node)
        stack.extend(graph[node])   # push neighbors
    return order
```

**Why this is good:** recursive DFS can overflow CPython's ~1000-frame stack on a deep or
large graph. An explicit stack makes DFS iterative, avoiding `RecursionError` while keeping
the same `O(V + E)` cost.

# Common Mistakes

- **Not tracking visited vertices.** On a cyclic graph the traversal loops forever; always
  keep a `visited` set.
- **Marking visited on dequeue (BFS).** Mark when you *enqueue*, or the same vertex can be
  queued multiple times, inflating work and possibly breaking shortest-path logic.
- **Using an adjacency matrix for a sparse graph.** `O(V²)` space is wasteful when `E ≪ V²`;
  use an adjacency list.
- **Using BFS/DFS for weighted shortest paths.** Fewest edges ≠ least weight — that needs
  Dijkstra or Bellman-Ford.

# Best Practices

- Default to an **adjacency list**; switch to a matrix only for dense graphs or `O(1)` edge tests.
- Use **BFS** for shortest paths in unweighted graphs and level-order processing; **DFS** for
  cycle detection, topological sort, and components.
- Mark vertices **visited on enqueue/push** and check before processing.
- For large graphs, prefer **iterative DFS** to avoid recursion-depth limits.

# Summary

- A graph is vertices plus edges (directed/undirected, weighted/unweighted).
- Adjacency lists use `O(V+E)` space (sparse); adjacency matrices `O(V²)` with `O(1)` edge lookup (dense).
- BFS (queue) explores by layers and finds unweighted shortest paths; DFS (stack) goes deep.
- Both traverse in `O(V + E)` with an adjacency list.
- Always track visited vertices, or cycles cause infinite loops.

# Flash Cards

Q: Which traversal finds shortest paths in an unweighted graph, and why?
A: BFS — it reaches vertices in order of edge-distance from the source, so the first time it reaches a vertex is via a fewest-edges path.

Q: What are the time complexities of BFS and DFS with an adjacency list?
A: Both are O(V + E) — each vertex and each edge is examined a constant number of times.

Q: What data structure does BFS use, and what does DFS use?
A: BFS uses a FIFO queue; DFS uses a stack (often the recursion call stack).

Q: How much space does an adjacency matrix use, and when is it worth it?
A: O(V²), worthwhile for dense graphs or when you need O(1) "is there an edge u→v?" lookups.

Q: Why must a graph traversal track visited vertices?
A: Graphs can contain cycles; without a visited set the traversal revisits nodes and loops forever.

Q: In BFS, when should you mark a vertex as visited?
A: When you enqueue it, so the same vertex is never enqueued more than once.

# Exercises

### Easy
Given an adjacency list, write `is_reachable(graph, start, goal)` using BFS or DFS. What is
its time complexity?

### Medium
Use DFS to count the number of **connected components** in an undirected graph. (Hint: run a
DFS from each unvisited vertex; each launch is one new component.)

### Challenging
Detect whether a **directed** graph has a cycle using DFS with three vertex colors
(white/unvisited, gray/in-progress, black/finished). Explain why encountering a gray vertex
during DFS proves a cycle exists.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 20
  ("Elementary Graph Algorithms"): representations, BFS, and DFS.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Sections 4.1–4.2 (undirected and directed graphs).
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Chapters 7–8 (graph traversal).
