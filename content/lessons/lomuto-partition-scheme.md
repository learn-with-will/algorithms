---
slug: lomuto-partition-scheme
title: "Lomuto Partition Scheme"
topic: sorting-algorithms
kind: technique
summary: "Lomuto partition uses a single forward scan to place the pivot key into its permanent sorted index."
tags: ["quicksort", "lomuto", "partitioning", "algorithms"]
related: ["hoare-partition-scheme", "quicksort-recursion-and-base-cases", "quicksort-worst-case-mitigation"]
---
> **In one line:** Lomuto partition scans forward with two pointers, placing the pivot into its final sorted position.

## The idea

The **partition algorithm** is the core subroutine of quicksort: it rearranges an array segment around a **pivot** element such that:
1. All elements less than or equal to the pivot are placed to its left.
2. All elements greater than the pivot are placed to its right.
3. The pivot is stationed at its final, permanent sorted index.

The **Lomuto partition scheme** (standard in CLRS) chooses the last element as the pivot and maintains two forward pointers:
- `i`: tracks the boundary of elements $\le$ pivot.
- `j`: scans forward through the array.

```flow
piv: Choose Pivot | last element arr[high] @primary
scan: Scan j from low to high-1 | compare with pivot @blue
swap: arr[j] <= pivot? | swap arr[i+1], arr[j] @amber
done: Place Pivot | swap arr[i+1], arr[high] @green
piv -> scan
scan -> swap
swap -> done
```

## See it

Lomuto partition implementation in Python:

```python
def lomuto_partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]  # Choose last element as pivot
    i = low - 1        # Boundary index of smaller elements
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
            
    # Place pivot in its correct sorted position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1  # Return pivot index

items = [10, 80, 30, 90, 40, 50, 70]
p_idx = lomuto_partition(items, 0, len(items) - 1)
print("Pivot index:", p_idx)
print("Rearranged:", items)  # 70 is placed at index 4!
```

## Go deeper

Lomuto's algorithm is straightforward and easy to prove using loop invariants:
- **Invariant:** At the start of each iteration, `arr[low..i]` $\le$ pivot, and `arr[i+1..j-1]` $>$ pivot.

However, Lomuto performs approximately **three times more swaps** than Hoare's scheme on random arrays, and degrades to $O(n^2)$ when all elements are identical because every element triggers a swap.

From an algorithmic engineering perspective, understanding the precise operational characteristics of lomuto partition scheme allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Lomuto partition degrades severely on arrays containing many duplicate elements.
- Remember that the pivot is placed at index i + 1, not i.

## Remember

- Lomuto uses the final element as pivot and scans forward with two pointers.
- Places the pivot at its exact, permanent sorted index.
- Easier to analyze than Hoare partition, but executes more memory swaps.
