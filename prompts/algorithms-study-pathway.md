# Algorithms & Data Structures Study Pathway
### A Comprehensive, Phase-by-Phase Curriculum

> **Based on:** CLRS (*Introduction to Algorithms*, 4th ed.), Sedgewick & Wayne
> (*Algorithms*, 4th ed.), Skiena (*The Algorithm Design Manual*, 3rd ed.), and the
> official Python documentation.
> **Language:** all implementations are in Python 3 (standard library only).
> **Approach:** each lesson builds on the ones before it. The order is intentional —
> heaps power Dijkstra, union-find powers Kruskal, and every paradigm in Phase 3
> assumes the analysis tools from Phase 1.

---

## Phase 1 — Beginner: Foundations & Core Data Structures

**Goal:** Learn how to reason about an algorithm's cost, and master the data
structures every later algorithm is built on.
**Exit criteria:** You can state the time/space complexity of a snippet, choose the
right elementary structure for a task, and implement recursion and the simple sorts.

1. **Algorithmic Thinking & Correctness** — what an algorithm is; input/output;
   correctness via loop invariants; pseudocode vs. Python; measuring cost by counting operations.
2. **Big-O and Complexity Analysis** — asymptotic notation (O, Ω, Θ); best/average/worst
   case; time vs. space; amortized vs. worst-case; the common growth classes.
3. **Arrays and Dynamic Arrays** — contiguous storage; O(1) random access; the
   amortized-O(1) append of a growable array; Python's `list`.
4. **Linked Lists** — singly and doubly linked; the node/pointer model; O(1)
   insert/delete at a known node vs. O(n) search; when a linked list beats an array.
5. **Stacks and Queues** — LIFO and FIFO; array- vs. linked-backed; `collections.deque`;
   applications (undo, expression evaluation, BFS frontier).
6. **Hash Tables** — hashing, collisions (chaining vs. open addressing), load factor;
   O(1) average / O(n) worst; Python's `dict` and `set`.
7. **Recursion and the Call Stack** — base and recursive cases; how the call stack
   frames work; recursion vs. iteration; stack-depth limits (`sys.setrecursionlimit`).
8. **Elementary Sorting** — bubble, selection, and insertion sort; stability and
   in-place; why they're O(n²); when insertion sort is genuinely the right choice.

---

## Phase 2 — Intermediate: Core Algorithms & Trees

**Goal:** Learn the workhorse searching and sorting algorithms and the tree/graph
structures that make them efficient.
**Exit criteria:** You can implement binary search correctly, explain and code the
O(n log n) sorts, use a heap as a priority queue, and traverse a graph with BFS/DFS.

9. **Linear and Binary Search** — sequential search; binary search and its *sorted*
   precondition; O(log n); the classic off-by-one bugs; Python's `bisect`.
10. **Divide and Conquer & Merge Sort** — the paradigm; merge sort's O(n log n); the
    merge step; stability; an intro to the recurrence / Master Theorem.
11. **Quicksort** — partitioning (Lomuto and Hoare); average O(n log n) vs. worst
    O(n²); pivot choice and randomization; why it's fast in practice.
12. **Heaps and Heapsort** — the binary-heap array layout; sift-up/sift-down; O(n)
    build-heap; heapsort; priority queues with Python's `heapq`.
13. **Binary Search Trees** — the BST property; search/insert/delete; in-order
    traversal; O(h) operations and why an unbalanced tree degrades to O(n).
14. **Balanced Trees (AVL / Red-Black)** — rotations; the height guarantee that keeps
    operations O(log n); where balanced trees show up (ordered maps, DB indexes).
15. **Graph Representations & Traversal** — adjacency list vs. matrix; BFS and DFS;
    O(V + E); connectivity, shortest path in unweighted graphs, cycle detection.
16. **Non-Comparison Sorting** — counting, radix, and bucket sort; the Ω(n log n)
    comparison lower bound and exactly how these algorithms sidestep it.

---

## Phase 3 — Advanced: Design Paradigms & Graph Algorithms

**Goal:** Learn the major algorithm-design paradigms and the classic graph and string
algorithms built from them.
**Exit criteria:** You can recognize optimal substructure and design a DP or greedy
solution, run the standard shortest-path and MST algorithms, use union-find, and
implement backtracking and KMP.

17. **Dynamic Programming I — Foundations** — optimal substructure and overlapping
    subproblems; memoization vs. tabulation; Fibonacci, coin change, 0/1 knapsack.
18. **Dynamic Programming II — Classic Problems** — longest common subsequence, edit
    distance, and longest increasing subsequence; reconstructing the solution.
19. **Greedy Algorithms** — the greedy-choice property; activity selection; Huffman
    coding; when greedy is optimal and when it silently fails (contrast with DP).
20. **Shortest Paths** — Dijkstra with a binary heap (non-negative weights);
    Bellman-Ford (handles negative edges, detects negative cycles).
21. **Minimum Spanning Trees** — the cut property; Kruskal (with union-find) and Prim
    (with a heap); why both are correct.
22. **Union-Find (Disjoint Set Union)** — union by rank/size + path compression; the
    near-constant amortized cost (inverse-Ackermann); connectivity and Kruskal.
23. **Backtracking** — systematic search with pruning; N-Queens, subsets, and
    permutations; recognizing the exponential search space and bounding it.
24. **String Matching** — the naive scan vs. Knuth–Morris–Pratt (the prefix/failure
    function, O(n + m)); a note on Rabin–Karp's rolling hash.

---

## How to use this pathway

- **Don't skip.** Phase 2's algorithms assume Phase 1's structures and analysis;
  Phase 3 assumes all of it (Dijkstra needs heaps; Kruskal needs union-find).
- **Do the exercises.** Each lesson ends with Easy/Medium/Challenging tasks — you
  learn algorithms by implementing and tracing them, not just reading.
- **Take the quizzes.** Every lesson has a quiz; a passing score means the model landed.
- **Verify against the sources.** When in doubt about a bound or a precondition,
  check CLRS or Sedgewick — accuracy over assumption.
