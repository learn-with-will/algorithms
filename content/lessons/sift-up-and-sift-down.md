---
slug: sift-up-and-sift-down
title: "Sift-Up and Sift-Down Restorations"
topic: trees-and-heaps
kind: technique
summary: "Restore heap order in O(log n) time by bubbling elements upward on insert or sinking them downward on extract."
tags: ["heap", "sift-up", "sift-down", "heapify"]
related: ["binary-heap-properties", "array-representation-of-heaps", "linear-time-build-heap"]
---
> **In one line:** Sift-up bubbles new elements upward on push; sift-down sinks root replacements downward on pop.

## The idea

When mutating a heap, the shape property is maintained by inserting or deleting at the end of the backing array. However, this may temporarily violate the heap-order property.

Two core operations restore the heap invariant in $O(\log n)$ time:

1. **Sift-Up (Bubble-Up):** Used during `push`. Append the new element at the end of the array (preserving complete shape), then repeatedly swap it with its parent until the heap-order property is satisfied.
2. **Sift-Down (Sink / Heapify):** Used during `pop`. Remove the root, replace it with the last element in the array, then repeatedly swap it with its smaller child until the heap-order property is restored.

```flow
p: Push Element | append to array end @primary
su: Sift-Up | swap with parent until valid @blue
pop: Pop Root | replace root with last element @amber
sd: Sift-Down | swap with smaller child until valid @green
p -> su
pop -> sd
```

## See it

Implementing sift-up and sift-down manually:

```python
def sift_up(heap: list[int], i: int) -> None:
    parent = (i - 1) // 2
    while i > 0 and heap[i] < heap[parent]:
        heap[i], heap[parent] = heap[parent], heap[i]
        i, parent = parent, (parent - 1) // 2

def sift_down(heap: list[int], i: int) -> None:
    n = len(heap)
    while 2 * i + 1 < n:
        smallest = 2 * i + 1
        if smallest + 1 < n and heap[smallest + 1] < heap[smallest]:
            smallest += 1
        if heap[i] <= heap[smallest]:
            break
        heap[i], heap[smallest] = heap[smallest], heap[i]
        i = smallest
```

## Go deeper

Both sift-up and sift-down traverse a single vertical path between the root and a leaf.

Because the height of a complete binary tree with $n$ nodes is strictly $\lfloor \log_2 n \rfloor$, neither operation can execute more than $\log_2 n$ swaps. Thus, both insertion and extraction have guaranteed **worst-case $O(\log n)$ runtime**.

From an algorithmic engineering perspective, understanding the precise operational characteristics of sift-up and sift-down restorations allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- In sift-down, you must swap with the SMALLEST of the two children in a min-heap; swapping with the larger child violates heap order.
- Always verify right child index is within bounds before comparing children.

## Remember

- Sift-up bubbles new items upward to restore parent <= child invariants.
- Sift-down swaps root replacements downward with the smaller child.
- Both operations traverse at most one path from root to leaf in O(log n) time.
