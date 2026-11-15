---
slug: linear-time-build-heap
title: "Linear-Time Heap Construction"
topic: trees-and-heaps
kind: concept
summary: "Building a heap bottom-up with sift-down operations runs in O(n) time, beating naive repeated O(n log n) insertions."
tags: ["build-heap", "heapify", "linear-time", "optimization"]
related: ["binary-heap-properties", "sift-up-and-sift-down", "heapsort-and-heapq-module"]
---
> **In one line:** Building a heap bottom-up with sift-down runs in linear O(n) time, beating repeated O(n log n) pushes.

## The idea

Given an arbitrary unsorted array of $n$ elements, how quickly can we convert it into a valid binary heap?

- **Naive approach:** Start with an empty heap and call `push` $n$ times. Each push takes $O(\log n)$, costing $O(n \log n)$ time.
- **Bottom-Up `build_heap` (Heapify):** Treat the raw array as a complete binary tree. All leaf nodes (from index $\lfloor n/2 \rfloor$ to $n-1$) are already valid 1-element heaps! We only need to call `sift_down` on the internal nodes, progressing in reverse order from index $\lfloor n/2 \rfloor - 1$ down to the root at index $0$.

```flow
leaf: Leaf Nodes (n/2 to n-1) | already valid heaps! @green
internal: Sift-Down Internal Nodes | from n//2 - 1 down to 0 @primary
root: Sift-Down Root | final heap restored in O(n) @blue
leaf -> internal
internal -> root
```

This bottom-up construction runs in **$\Theta(n)$ linear time**.

## See it

Bottom-up linear-time heapify in Python:

```python
def heapify(arr: list[int]) -> None:
    """Transform list into a min-heap in-place in O(n) time."""
    n = len(arr)
    
    def sift_down(i: int):
        while 2 * i + 1 < n:
            smallest = 2 * i + 1
            right = smallest + 1
            if right < n and arr[right] < arr[smallest]:
                smallest = right
            if arr[i] <= arr[smallest]:
                break
            arr[i], arr[smallest] = arr[smallest], arr[i]
            i = smallest

    # Start from the last non-leaf parent node down to 0
    for i in range(n // 2 - 1, -1, -1):
        sift_down(i)

data = [90, 15, 10, 7, 12, 2, 8]
heapify(data)
print("Heapified array:", data)  # Root is data[0] = 2 (minimum!)
```

## Go deeper

Why is `build_heap` $O(n)$ rather than $O(n \log n)$?

In a complete binary tree, half the nodes ($n/2$) are leaves with height 0 (costing 0 work). A quarter of the nodes ($n/4$) have height 1 (at most 1 swap). An eighth have height 2 (at most 2 swaps).
Summing total work across heights:
$$\sum_{h=0}^{\lfloor \log n \rfloor} \frac{n}{2^{h+1}} \cdot O(h) = O\left(n \sum_{h=0}^{\infty} \frac{h}{2^h}\right)$$
Because $\sum_{h=0}^{\infty} h / 2^h = 2$ (a convergent series), the total work is bounded by $2n = O(n)$.

From an algorithmic engineering perspective, understanding the precise operational characteristics of linear-time heap construction allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Building a heap by repeatedly calling heappush() takes O(n log n); use heapq.heapify() for O(n).
- Sift-down must run backwards from n//2 - 1 to 0; running forward does not work because child subtrees are not yet heaps.

## Remember

- Bottom-up build_heap converts an arbitrary array into a heap in O(n) time.
- Leaves at indices n//2 to n-1 require zero sift operations.
- Python's heapq.heapify() implements this linear-time construction.
