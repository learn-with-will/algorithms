---
slug: selection-sort-and-write-minimization
title: "Selection Sort and Write Minimization"
topic: sorting-algorithms
kind: technique
summary: "Selection sort repeatedly finds the minimum remaining element, executing at most O(n) memory swap writes."
tags: ["sorting", "selection-sort", "write-minimization", "in-place"]
related: ["bubble-sort-mechanics", "insertion-sort-and-online-processing", "in-place-sorting-trade-offs"]
---
> **In one line:** Selection sort minimizes memory writes by swapping at most once per pass to place the minimum element.

## The idea

**Selection sort** divides the array into a sorted prefix and an unsorted suffix. On each pass, it scans the unsorted suffix to find the minimum element and swaps it with the first unsorted item.

Unlike bubble sort, which performs thousands of swaps, selection sort performs **at most $n - 1$ swaps in total**.

| Metric | Selection Sort | Bubble Sort | Insertion Sort |
|---|---|---|---|
| **Comparisons (All Cases)** | $\frac{n(n-1)}{2}$ | $O(n^2)$ | $O(n^2)$ worst, $O(n)$ best |
| **Total Memory Swaps** | **At most $n - 1$** ($O(n)$) | $O(n^2)$ | $O(n^2)$ |
| **Stability** | Unstable (in standard form) | Stable | Stable |

This property makes selection sort valuable in flash memory or EEPROM environments where write cycles cause physical hardware degradation.

## See it

Implementation of selection sort:

```python
def selection_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n - 1):
        # Assume minimum is the first unsorted element
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
                
        # Swap minimum into its final sorted position (at most 1 swap per pass)
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            
    return arr

nums = [29, 10, 14, 37, 13]
print(selection_sort(nums))  # [10, 13, 14, 29, 37]
```

## Go deeper

Why is standard selection sort **unstable**? 

Consider sorting `[4a, 4b, 2]`:
1. On pass 1, the minimum is `2` at index 2.
2. Selection sort swaps `4a` with `2`, resulting in `[2, 4b, 4a]`.
The relative order of equal keys `4a` and `4b` has been reversed!

Selection sort always executes $\Theta(n^2)$ comparisons regardless of whether the array is reverse sorted, random, or already sorted.

From an algorithmic engineering perspective, understanding the precise operational characteristics of selection sort and write minimization allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Selection sort does not adapt to already-sorted data; it always makes Theta(n^2) comparisons.
- Standard selection sort is not stable; equal elements can swap positions.

## Remember

- Selection sort repeatedly finds the minimum remaining element.
- Guarantees at most O(n) total write/swap operations.
- Runs in Theta(n^2) comparisons across all best, average, and worst cases.
