---
slug: array-representation-of-heaps
title: "Array Representation of Binary Trees"
topic: trees-and-heaps
kind: technique
summary: "Store complete binary trees in flat arrays with implicit parent and child indices without pointer overhead."
tags: ["heap", "array-representation", "indexing", "memory-locality"]
related: ["binary-heap-properties", "sift-up-and-sift-down", "linear-time-build-heap"]
---
> **In one line:** Store complete binary trees in flat arrays using simple arithmetic for parent and child indices.

## The idea

Because a binary heap is a complete binary tree with no internal missing leaves, it can be stored in a **contiguous array** without any pointer objects (`left`, `right`, `parent`).

Tree relationships are computed instantly using zero-based index arithmetic:

| Relationship | Formula from Index $i$ | Example ($i = 1$) |
|---|---|---|
| **Parent Index** | $(i - 1) // 2$ | $(1 - 1) // 2 = 0$ (Root) |
| **Left Child Index** | $2i + 1$ | $2(1) + 1 = 3$ |
| **Right Child Index** | $2i + 2$ | $2(1) + 2 = 4$ |

Storing trees in flat arrays eliminates pointer storage overhead (saving 16 bytes per node) and provides optimal CPU cache prefetching during traversals.

## See it

Navigating array heap relationships in Python:

```python
def parent(i: int) -> int:
    return (i - 1) // 2

def left_child(i: int) -> int:
    return 2 * i + 1

def right_child(i: int) -> int:
    return 2 * i + 2

heap = [10, 15, 30, 40, 50, 100]
root = 0
print("Root:", heap[root])
print("Left child of root: ", heap[left_child(root)])   # 15 at index 1
print("Right child of root:", heap[right_child(root)])  # 30 at index 2
print("Parent of index 3:   ", heap[parent(3)])          # 15 at index 1
```

## Go deeper

In textbooks utilizing 1-based indexing (like CLRS), the formulas are even simpler:
- Parent: $i // 2$
- Left: $2i$
- Right: $2i + 1$

Notice that multiplication by 2 is a single-cycle bitwise left shift (`i << 1`), and parent division by 2 is a bitwise right shift (`i >> 1`). This arithmetic efficiency made array heaps a landmark breakthrough in low-level memory systems.

From an algorithmic engineering perspective, understanding the precise operational characteristics of array representation of binary trees allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Always check that computed child indices do not exceed the array length before accessing elements.
- The root node (index 0) has no parent; accessing (0 - 1) // 2 in Python returns index -1 (the last element!).

## Remember

- Complete binary trees map directly into flat contiguous arrays without pointers.
- Left child is at 2i + 1; right child is at 2i + 2; parent is at (i - 1) // 2.
- Delivers optimal CPU cache prefetching and zero pointer memory overhead.
