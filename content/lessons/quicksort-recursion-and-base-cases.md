---
slug: quicksort-recursion-and-base-cases
title: "Quicksort Recursive Structure"
topic: sorting-algorithms
kind: concept
summary: "Quicksort partitions the array around a pivot and recursively sorts the left and right subarrays."
tags: ["quicksort", "divide-and-conquer", "recursion", "sorting"]
related: ["lomuto-partition-scheme", "hoare-partition-scheme", "quicksort-worst-case-mitigation"]
---
> **In one line:** Quicksort partitions the array around a pivot and recursively sorts the resulting left and right halves.

## The idea

**Quicksort** is a divide-and-conquer sorting algorithm that operates in reverse compared to merge sort:
- **Merge sort** divides trivially in half, sorts recursively, and does all complex work during the **combine** step.
- **Quicksort** does all the heavy work during the **divide (partition)** step, so that the combine step requires zero work.

```tree
[10, 80, 30, 90, 40, 50, 70]
  Partition around 70 -> [10, 30, 40, 50] + [70] + [90, 80]
  Left subarray recurses -> [10, 30, 40, 50]
  Right subarray recurses -> [80, 90]
  Combine: Concatenation is free!
```

On average, quicksort runs in **$O(n \log n)$ time** with outstanding cache locality, making it historically the fastest general-purpose comparison sort.

## See it

Complete quicksort algorithm using Lomuto partition:

```python
def quicksort(arr: list[int], low: int = 0, high: int = -1) -> list[int]:
    if high == -1:
        high = len(arr) - 1
        
    if low < high:
        # Partition places pivot at its permanent index
        pivot_idx = lomuto_partition(arr, low, high)
        # Recursively sort left and right partitions
        quicksort(arr, low, pivot_idx - 1)
        quicksort(arr, pivot_idx + 1, high)
        
    return arr

sample = [10, 7, 8, 9, 1, 5]
print("Sorted:", quicksort(sample))  # [1, 5, 7, 8, 9, 10]
```

## Go deeper

Quicksort's average time complexity satisfies $T(n) = 2T(n/2) + O(n) = O(n \log n)$.

However, quicksort is **unstable**: partition swaps elements across long distances without preserving the relative order of identical keys. In addition, its stack depth is $O(\log n)$ on average, but can degrade to $O(n)$ if partitions are highly skewed.

From an algorithmic engineering perspective, understanding the precise operational characteristics of quicksort recursive structure allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Quicksort is not stable; duplicate keys can be reordered.
- A naive implementation choosing the first or last element as pivot degrades to O(n^2) on already-sorted arrays.

## Remember

- Quicksort does its primary work during the partition divide step.
- Average time is O(n log n) with excellent CPU memory cache locality.
- No merge step is needed; subarrays are sorted directly in-place.
