---
slug: counting-sort-algorithm
title: "Counting Sort on Bounded Integers"
topic: sorting-algorithms
kind: technique
summary: "Sort integer keys in O(n + k) time by tallying element frequencies and computing prefix sum indices."
tags: ["counting-sort", "non-comparison", "linear-time", "integers"]
related: ["comparison-sort-lower-bound", "radix-sort-lsd-and-msd", "bucket-sort-distribution"]
---
> **In one line:** Counting sort beats Omega(n log n) by tallying key occurrences, sorting bounded integers in O(n + k) time.

## The idea

**Counting sort** is a non-comparison sorting algorithm that sorts a collection of $n$ integers whose values lie within a known bounded range $[0, k]$.

Instead of comparing elements, counting sort:
1. Counts the frequency of each key in an auxiliary array `count` of size $k + 1$.
2. Computes the prefix sums of `count` so that each entry indicates the starting index of that key in the sorted output.
3. Scans the input array from right to left, placing elements directly into their designated positions in an output array.

| Property | Value | Notes |
|---|---|---|
| **Time Complexity** | $\Theta(n + k)$ | Linear when $k = O(n)$ |
| **Space Complexity** | $\Theta(n + k)$ | Requires count array of size $k$ and output array of size $n$ |
| **Stability** | **Stable** | Right-to-left scan preserves original order of duplicate keys |

When range $k$ is $O(n)$, counting sort achieves **linear $O(n)$ time**, beating comparison sorts!

## See it

Complete stable counting sort in Python:

```python
def counting_sort(arr: list[int]) -> list[int]:
    if not arr:
        return []
    min_val, max_val = min(arr), max(arr)
    k = max_val - min_val + 1
    count = [0] * k
    output = [0] * len(arr)
    for num in arr:
        count[num - min_val] += 1
    for i in range(1, k):
        count[i] += count[i - 1]
    for num in reversed(arr):
        idx = count[num - min_val] - 1
        output[idx] = num
        count[num - min_val] -= 1
    return output

print(counting_sort([4, 2, 2, 8, 3, 3, 1]))  # [1, 2, 2, 3, 3, 4, 8]
```

## Go deeper

Scanning from right to left during step 3 is what makes counting sort **stable**: if two identical numbers appear at indices $i$ and $j$ with $i < j$, the right-to-left scan encounters $j$ first and places it into the higher slot, decrementing the count for subsequent placement of $i$ into the earlier slot.

This stability is what enables Radix sort to operate correctly on multi-digit keys.

From an algorithmic engineering perspective, understanding the precise operational characteristics of counting sort on bounded integers allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- If range k is significantly larger than n (e.g. sorting 10 numbers ranging from 1 to 10^9), counting sort wastes gigabytes of memory.
- Cannot directly sort floating point numbers or arbitrary string keys.

## Remember

- Counts frequencies and uses prefix sums to place elements directly.
- Runs in linear O(n + k) time when range k is proportional to n.
- Strictly stable when populated right-to-left.
