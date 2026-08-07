---
id: lesson-12
slug: heaps-and-heapsort
title: "Heaps and Heapsort"
level: intermediate
order: 12
duration: 30
tags:
  - heap
  - priority-queue
  - heapsort
  - heapq
  - binary-heap
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe a **binary heap** and how it maps a complete binary tree into an array.
- Implement `sift-up` and `sift-down` and know they are `O(log n)`.
- Explain why **build-heap** is `O(n)`, not `O(n log n)`.
- Implement **heapsort** and state that it is in-place but not stable.
- Use a heap as a **priority queue** via Python's `heapq`.

# Why This Concept Exists

Many algorithms repeatedly need "the smallest (or largest) item remaining" — Dijkstra's
shortest paths, event simulation, scheduling, and finding the top-k. A sorted list gives
`O(1)` access to the minimum but `O(n)` insertion; an unsorted list is the reverse. A
**binary heap** gives the best balance: `O(1)` to peek at the extreme element and
`O(log n)` to insert or remove it. It is the standard implementation of a **priority
queue**, and it also yields **heapsort**, an in-place `O(n log n)` sort.

# Concept Explanation

### A heap is a complete binary tree in an array

A **binary heap** is a *complete* binary tree (every level full except possibly the last,
which fills left to right) satisfying the **heap property**:

- **Min-heap:** every node's key is ≤ its children's keys → the minimum is at the root.
- **Max-heap:** every node's key is ≥ its children's keys → the maximum is at the root.

Because the tree is complete, it packs perfectly into an array with no gaps. For a node at
index `i` (0-based):

```text
parent(i) = (i - 1) // 2
left(i)   = 2*i + 1
right(i)  = 2*i + 2

array:  [ 1, 3, 6, 5, 9, 8 ]        tree:       1
          0  1  2  3  4  5                     /   \
                                              3     6
                                             / \   /
                                            5   9 8
```

### Sift-up and sift-down

The heap property is restored by moving a node along a single root-to-leaf path:

- **Sift-up** (after inserting at the end): swap the new node with its parent while it
  violates the heap property. At most the tree's height, so `O(log n)`.
- **Sift-down** (after removing the root): move the offending node down, swapping with its
  smaller (min-heap) child, until the property holds. Also `O(log n)`.

### The core operations

- **peek** — the root, `O(1)`.
- **push** — append at the end, sift-up, `O(log n)`.
- **pop** (extract-min/max) — swap root with the last element, remove it, sift the new root
  down, `O(log n)`.

### Build-heap is O(n)

Turning an arbitrary array into a heap by sifting **down** from the last internal node up to
the root is `O(n)`, *not* `O(n log n)`. The reason: most nodes are near the bottom and sift
down only a little. Summing each node's possible sift distance gives a series bounded by
`O(n)`. (Inserting `n` elements one at a time with sift-up *would* be `O(n log n)`; bottom-up
build-heap is the faster construction.)

### Heapsort

Heapsort sorts in place using a max-heap:

1. Build a max-heap from the array — `O(n)`.
2. Repeatedly swap the root (the maximum) with the last unsorted element and sift the new
   root down over the shrunken heap — `n` times, each `O(log n)`.

Total: `O(n log n)`, **in place** (`O(1)` extra space), but **not stable**.

# Key Terminology

- **Binary heap** — a complete binary tree with the heap property, stored in an array.
- **Heap property** — parent ≤ children (min-heap) or parent ≥ children (max-heap).
- **Sift-up / sift-down** — restore the heap property upward / downward, `O(log n)`.
- **Priority queue** — an ADT serving the highest-priority element first; heaps implement it.
- **Build-heap** — construct a heap from an array bottom-up in `O(n)`.

# Complexity

| Operation | Time |
| --------- | ---- |
| peek (min/max) | O(1) |
| push (insert) | O(log n) |
| pop (extract-min/max) | O(log n) |
| build-heap (from n items) | O(n) |
| heapsort | O(n log n), in-place, not stable |

# Implementation in Python

```python
import heapq

# heapq is a MIN-heap over a plain list.
h: list[int] = []
heapq.heappush(h, 5)         # O(log n)
heapq.heappush(h, 1)
heapq.heappush(h, 3)
smallest = h[0]              # peek the minimum: O(1)
heapq.heappop(h)            # remove & return 1: O(log n)

nums = [9, 4, 7, 1, 2]
heapq.heapify(nums)         # build-heap in O(n); nums is now a valid min-heap

# A max-heap: push negated values (heapq has no max-heap directly)
maxh: list[int] = []
for x in [3, 1, 4, 1, 5]:
    heapq.heappush(maxh, -x)
largest = -maxh[0]          # 5
```

# Real World Analogy

A heap is a **hospital emergency room**. Patients are not served in arrival order but by
**priority**: the most critical case is always seen next, no matter how long the queue is.
When a new patient arrives, they are slotted into the right place (sift-up); when the most
critical patient is treated, the next-most-critical rises to the front (sift-down). You can
always find the top-priority patient instantly — that is the `O(1)` peek.

# Examples

## Example 1 — Basic: a priority queue of tasks

```python
import heapq

tasks: list[tuple[int, str]] = []
heapq.heappush(tasks, (2, "email"))
heapq.heappush(tasks, (1, "deploy"))   # lower number = higher priority
heapq.heappush(tasks, (3, "cleanup"))

while tasks:
    priority, name = heapq.heappop(tasks)   # always the smallest priority first
    print(priority, name)                   # 1 deploy, 2 email, 3 cleanup
```

**Why this is good:** tuples compare lexicographically, so `(priority, name)` makes `heapq`
a priority queue for free. Each push/pop is `O(log n)`, so draining `n` tasks in priority
order is `O(n log n)`.

## Example 2 — Real-world: k largest elements

```python
import heapq

def k_largest(nums: list[int], k: int) -> list[int]:
    # Keep a min-heap of size k; the smallest of the top-k sits at the root.
    heap: list[int] = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)      # evict the smallest -> keeps the k largest
    return sorted(heap, reverse=True)
```

**Why this is good:** a size-`k` heap finds the top-`k` in `O(n log k)` time and `O(k)`
space — far better than sorting all `n` when `k` is small. (Python's `heapq.nlargest` does
exactly this.)

## Example 3 — Best practice / edge case: build-heap is O(n)

```python
import heapq

nums = list(range(1_000_000))
heapq.heapify(nums)     # O(n) -- NOT O(n log n)
```

**Why this is good:** it highlights the frequently-misquoted bound. Constructing a heap from
an existing array with `heapify` is `O(n)`; inserting the same elements one by one would be
`O(n log n)`. When you already have all the data, always `heapify`.

# Common Mistakes

- **Claiming build-heap is `O(n log n)`.** Bottom-up `heapify` is `O(n)`; only one-by-one
  insertion is `O(n log n)`.
- **Expecting `heapq` to be a max-heap.** It is a min-heap; negate values (or use
  `heapq.nlargest`) for max behaviour.
- **Assuming heapsort is stable.** It is not; equal keys can be reordered.
- **Mis-indexing children.** With 0-based arrays, children of `i` are `2i+1` and `2i+2`, not
  `2i` and `2i+1`.

# Best Practices

- Use `heapq` for priority queues; store `(priority, item)` tuples.
- `heapify` an existing list (`O(n)`) instead of pushing elements one at a time.
- For top-k, keep a size-`k` heap (`O(n log k)`) rather than sorting everything.
- Reach for heapsort when you need an in-place `O(n log n)` sort and do not need stability.

# Summary

- A binary heap is a complete binary tree with the heap property, stored compactly in an array.
- peek is `O(1)`; push and pop are `O(log n)` via sift-up / sift-down.
- Build-heap from an array is `O(n)` (bottom-up), not `O(n log n)`.
- Heapsort is in-place `O(n log n)` but not stable.
- Heaps implement priority queues — the engine behind Dijkstra, scheduling, and top-k.

# Flash Cards

Q: What is the heap property of a min-heap?
A: Every node's key is less than or equal to its children's keys, so the minimum sits at the root.

Q: For a 0-based heap array, what are the indices of node i's children?
A: Left child 2i+1 and right child 2i+2; its parent is (i-1)//2.

Q: What is the time to push or pop from a binary heap of n elements?
A: O(log n) — the element sifts up or down along one root-to-leaf path.

Q: Is building a heap from n elements O(n) or O(n log n)?
A: Bottom-up build-heap (heapify) is O(n); inserting one at a time would be O(n log n).

Q: Is heapsort stable, and is it in-place?
A: It is in-place (O(1) extra space) but not stable.

Q: Is Python's heapq a min-heap or a max-heap?
A: A min-heap; for max behaviour, push negated values or use heapq.nlargest.

# Exercises

### Easy
Using `heapq`, write `merge_sorted(lists)` that merges several already-sorted lists into one
sorted list. (Hint: `heapq.merge` does this — reproduce its idea with a heap of `(value,
list_index, elem_index)`.)

### Medium
Implement `sift_down(heap, i, size)` for a min-heap by hand and use it to write an
in-place `heapsort` (build a max-heap, then repeatedly extract). Confirm it is `O(n log n)`.

### Challenging
Prove that bottom-up build-heap is `O(n)`. (Hint: a node at height `h` sifts down at most
`h` steps, and there are at most `⌈n / 2^{h+1}⌉` nodes at height `h`; sum `h · n / 2^{h+1}`
over all heights and show it converges to `O(n)`.)

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 6
  ("Heapsort"), including the `O(n)` build-heap analysis and priority queues.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 2.4 ("Priority Queues").
- Python — [`heapq`](https://docs.python.org/3/library/heapq.html) documentation.
