---
slug: adjacency-matrix-vs-adjacency-list
title: "Adjacency Matrices Versus Adjacency Lists"
topic: graph-traversals-and-connectivity
kind: concept
summary: "Adjacency matrices provide O(1) edge checks at O(V^2) memory, while adjacency lists optimize sparse graphs at O(V + E)."
tags: ["graphs", "adjacency-list", "adjacency-matrix", "data-structures"]
related: ["breadth-first-search-bfs", "depth-first-search-dfs", "cycle-detection-and-connectivity"]
---
> **In one line:** Adjacency matrices provide O(1) edge lookups; adjacency lists optimize memory on sparse graphs.

## The idea

A **graph** $G = (V, E)$ consists of a set of vertices $V$ and edges $E$. How a graph is represented in memory dictates the time and space complexity of every downstream algorithm:

1. **Adjacency Matrix:** A 2D array of size $|V| \times |V|$ where `matrix[u][v] == 1` indicates an edge exists between $u$ and $v$.
2. **Adjacency List:** An array or hash map of size $|V|$ where each entry `adj[u]` stores a list of neighbor vertices connected to $u$.

| Operation | Adjacency Matrix | Adjacency List |
|---|---|---|
| **Space Complexity** | $\Theta(V^2)$ | **$\Theta(V + E)$** |
| **Check Edge $(u, v)$** | **$O(1)$** | $O(\text{degree}(u))$ |
| **Iterate Neighbors of $u$** | $\Theta(V)$ | **$\Theta(\text{degree}(u))$** |
| **Best Used When...** | **Dense graphs** ($|E| \approx |V|^2$) | **Sparse graphs** ($|E| \ll |V|^2$) |

In real-world networks (social graphs, road maps, web links), graphs are overwhelmingly sparse ($|E| = O(V)$), making adjacency lists the universal default.

## See it

Comparing graph representations in Python:

```python
# Adjacency List: dict of lists (standard in Python)
adj_list = {
    0: [1, 2],
    1: [0, 3],
    2: [0],
    3: [1]
}

# Adjacency Matrix: 2D list of size 4x4
adj_matrix = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 0],
    [0, 1, 0, 0]
]

# Check if edge exists between 1 and 3:
print("Matrix check:", bool(adj_matrix[1][3]))  # O(1)
print("List check:  ", 3 in adj_list[1])         # O(degree)
```

## Go deeper

Consider a road network with 1 million cities ($|V| = 10^6$) where each city connects to an average of 4 highways ($|E| = 4 \times 10^6$):
- An **adjacency list** stores $10^6$ vertices and $4 \times 10^6$ edges, consuming approximately $40\text{ MB}$ of RAM.
- An **adjacency matrix** requires $10^{12}$ entries ($1\text{ trillion}$ slots), consuming $1\text{ Terabyte}$ of RAM!

Representing sparse graphs as matrices is catastrophically wasteful in memory and slows down traversals from $O(V + E)$ to $O(V^2)$.

From an algorithmic engineering perspective, understanding the precise operational characteristics of adjacency matrices versus adjacency lists allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Never use an adjacency matrix for graphs with millions of vertices; memory scales quadratically with V^2.
- Iterating all neighbors of a vertex in an adjacency matrix always takes Theta(V) time, even if the vertex has 0 edges.

## Remember

- Adjacency lists use Theta(V + E) space, optimal for sparse real-world graphs.
- Adjacency matrices provide O(1) edge checks, but require Theta(V^2) memory.
- Adjacency lists allow iterating neighbors in time proportional to vertex degree.
