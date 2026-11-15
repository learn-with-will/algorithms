---
slug: merge-sort-implementation
title: "Merge Sort Implementation"
topic: sorting-algorithms
kind: technique
summary: "Merge sort guarantees stable, worst-case O(n log n) sorting by recursively bisecting and merging arrays."
tags: ["merge-sort", "divide-and-conquer", "stable", "sorting"]
related: ["merge-step-mechanics", "merge-sort-space-trade-off", "master-theorem-for-divide-and-conquer"]
---
> **In one line:** Merge sort recursively divides an array in half and merges sorted halves in guaranteed O(n log n) time.

## The idea

**Merge sort** is an archetype of divide-and-conquer. It recursively splits an array in half until individual elements (base cases) are reached, and then merges sorted sub-arrays back together.

```tree
[38, 27, 43, 3, 9, 82, 10]
  [38, 27, 43, 3] Left Half
    [38, 27] -> [27, 38]
    [43, 3] -> [3, 43]
  [9, 82, 10] Right Half
    [9]
    [82, 10] -> [10, 82]
```

Merge sort provides a rock-solid guarantee: **$O(n \log n)$ time across best, average, and worst cases**. It never degrades on adversarial inputs.

## See it

Complete merge sort implementation:

```python
def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge sorted halves
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

data = [38, 27, 43, 3, 9, 82, 10]
print("Sorted:", merge_sort(data))  # [3, 9, 10, 27, 38, 43, 82]
```

## Go deeper

The recurrence relation for merge sort is:
$$T(n) = 2T(n/2) + \Theta(n)$$
At each tree level, the total work spent merging across all subproblems is exactly $\Theta(n)$. The depth of the recursion tree is $\lfloor \log_2 n \rfloor + 1$. 

Multiplying $\Theta(n)$ work per level by $\log_2 n$ levels yields $\Theta(n \log n)$ total work, universally across all input permutations.

From an algorithmic engineering perspective, understanding the precise operational characteristics of merge sort implementation allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Standard merge sort creates many intermediate slice copies; production implementations allocate a single reusable auxiliary buffer.
- Remember that base case is len(arr) <= 1, not len(arr) == 0.

## Remember

- Guarantees O(n log n) running time across best, average, and worst cases.
- Strictly stable: preserves relative ordering of duplicate keys.
- Requires O(n) auxiliary memory to hold merged elements.
