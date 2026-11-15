---
slug: hoare-partition-scheme
title: "Hoare Partition Scheme"
topic: sorting-algorithms
kind: technique
summary: "Hoare partition scans inwards from both ends, performing approximately three times fewer swaps than Lomuto."
tags: ["quicksort", "hoare", "partitioning", "optimization"]
related: ["lomuto-partition-scheme", "quicksort-recursion-and-base-cases", "quicksort-worst-case-mitigation"]
---
> **In one line:** Hoare partition uses two inward-moving pointers to partition arrays with minimal swap operations.

## The idea

Developed by Sir Tony Hoare in 1959, the original **Hoare partition scheme** scans inward from both ends of the array using two pointers:
- `i` advances rightward looking for an element $\ge$ pivot.
- `j` retreats leftward looking for an element $\le$ pivot.
- When inverted out-of-order elements are found, they are swapped.

| Metric | Hoare Partition | Lomuto Partition |
|---|---|---|
| **Pointer Motion** | Inward from both ends | Single forward scan |
| **Average Swaps** | $\approx n / 6$ swaps | $\approx n / 2$ swaps ($3\times$ more) |
| **Pivot Placement** | Pivot is not necessarily at index $j$ | Pivot is placed at exact index |
| **Duplicate Keys** | Handles duplicates gracefully | Degrades on identical keys |

Hoare's method executes significantly fewer memory writes, making it the preferred partition scheme in performance-tuned production libraries.

## See it

Hoare partition implementation:

```python
def hoare_partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[low]
    i = low - 1
    j = high + 1
    
    while True:
        i += 1
        while arr[i] < pivot:
            i += 1
            
        j -= 1
        while arr[j] > pivot:
            j -= 1
            
        if i >= j:
            return j  # Partition boundary
            
        arr[i], arr[j] = arr[j], arr[i]

nums = [5, 3, 8, 4, 2, 7, 1, 10]
split_idx = hoare_partition(nums, 0, len(nums) - 1)
print("Partition boundary:", split_idx)
print("Partitioned array:", nums)
```

## Go deeper

A crucial difference: Hoare partition does **not** necessarily place the pivot element at index `j`. 

Instead, it guarantees that all elements in `arr[low..j]` are $\le$ all elements in `arr[j+1..high]`. Consequently, quicksort using Hoare partition must recurse on `(low, j)` and `(j+1, high)`, unlike Lomuto which recurses on `(low, p-1)` and `(p+1, high)`.

From an algorithmic engineering perspective, understanding the precise operational characteristics of hoare partition scheme allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- In Hoare partition, the pivot is not necessarily at index j; recurse on (low, j) and (j+1, high).
- Using strict inequalities while arr[i] < pivot prevents infinite loops when duplicate keys match the pivot.

## Remember

- Hoare partition scans inward from both ends of the array.
- Executes approximately three times fewer swaps than Lomuto partition.
- Subarrays are partitioned into [low..j] and [j+1..high].
