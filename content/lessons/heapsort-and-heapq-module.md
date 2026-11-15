---
slug: heapsort-and-heapq-module
title: "Heapsort and Python's heapq Module"
topic: trees-and-heaps
kind: tool
summary: "Heapsort delivers in-place O(n log n) sorting, while Python's heapq module provides efficient min-heap operations."
tags: ["heapsort", "heapq", "python-standard-library", "priority-queue"]
related: ["binary-heap-properties", "linear-time-build-heap", "quickselect-kth-smallest-element"]
---
> **In one line:** Heapsort sorts strictly in-place in O(n log n) time; heapq provides efficient min-heaps in Python.

## The idea

**Heapsort** leverages the binary heap to deliver an in-place comparison sort:
1. Build a **max-heap** from the input array in $O(n)$ time using bottom-up `heapify`.
2. Swap the root (maximum element) with the last element of the heap.
3. Decrement the heap size boundary and call `sift_down` on the new root.
4. Repeat until the heap size reduces to 1. The array is now fully sorted in ascending order!

| Algorithm | Best Time | Worst Time | Auxiliary Space | Stable? |
|---|---|---|---|---|
| **Heapsort** | $O(n \log n)$ | $O(n \log n)$ | **$O(1)$ strictly in-place** | No |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ buffer | **Yes** |
| **Quicksort** | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ stack | No |

Python's `heapq` module provides standard C-speed min-heap operations (`heappush`, `heappop`, `heapify`, `nlargest`, `nsmallest`).

## See it

Using heapq and implementing Heapsort:

```python
import heapq

# Finding k largest elements in O(n log k) time:
scores = [45, 92, 12, 78, 64, 88, 99, 23]
top_3 = heapq.nlargest(3, scores)
print("Top 3 scores:", top_3)  # [99, 92, 88]

# Heapsort using heapq:
def heapsort_simple(arr: list[int]) -> list[int]:
    h = arr.copy()
    heapq.heapify(h)
    return [heapq.heappop(h) for _ in range(len(h))]

print("Sorted:", heapsort_simple([5, 1, 9, 3, 7]))  # [1, 3, 5, 7, 9]
```

## Go deeper

Python's `heapq` only provides **min-heaps**. To implement a max-heap:
1. Store negated values (`-x`), so the largest positive value becomes the smallest negative value.
2. In Python 3.8+, use `heapq._heapify_max()` for internal max-heap construction.

Heapsort is rarely used as Python's primary sort because it has poor CPU cache locality (jumping across array indices during sift-down). Timsort is preferred for general sorting, while heaps excel at priority queues and streaming top-$k$ tracking.

From an algorithmic engineering perspective, understanding the precise operational characteristics of heapsort and python's heapq module allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- heapq implements a MIN-heap; the smallest item is at index 0, not the largest.
- Heapsort is not stable; equal keys can be reordered during root swaps.

## Remember

- Heapsort achieves O(n log n) running time strictly in-place with O(1) space.
- Python's heapq module implements efficient min-heap routines in C.
- Use heapq.nlargest and nsmallest for tracking top-k items in streaming data.
