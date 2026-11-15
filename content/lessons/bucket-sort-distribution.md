---
slug: bucket-sort-distribution
title: "Bucket Sort for Uniform Distributions"
topic: sorting-algorithms
kind: technique
summary: "Partition numbers uniformly into k buckets, sort individual buckets, and concatenate them in linear expected time."
tags: ["bucket-sort", "distribution", "floats", "linear-time"]
related: ["counting-sort-algorithm", "radix-sort-lsd-and-msd", "when-to-use-non-comparison-sorts"]
---
> **In one line:** Bucket sort distributes values uniformly across buckets, sorts buckets individually, and concatenates.

## The idea

**Bucket sort** is a distribution sort designed for inputs drawn uniformly and independently from a continuous interval, such as floating-point numbers in $[0, 1)$.

The algorithm proceeds in four steps:
1. Divide the interval $[0, 1)$ into $k$ equal-sized sub-intervals called **buckets**.
2. Distribute each element $A[i]$ into its designated bucket index $\lfloor k \cdot A[i] \rfloor$.
3. Sort each individual bucket using an algorithm with low constant factors (typically Insertion Sort).
4. Concatenate all buckets in sequence to produce the sorted array.

When input values are uniformly distributed, each bucket receives $O(1)$ elements on average, resulting in **$O(n)$ average running time**.

## See it

Implementation of bucket sort on floating-point numbers:

```python
def bucket_sort(arr: list[float]) -> list[float]:
    if not arr:
        return []
    n = len(arr)
    buckets: list[list[float]] = [[] for _ in range(n)]
    
    # 1. Distribute into buckets
    for num in arr:
        idx = int(n * num)
        if idx >= n:
            idx = n - 1
        buckets[idx].append(num)
        
    # 2. Sort individual buckets and concatenate
    result = []
    for bucket in buckets:
        bucket.sort()  # Small bucket sorted in near O(1)
        result.extend(bucket)
        
    return result

floats = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]
print(bucket_sort(floats))
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

Bucket sort performance depends entirely on the **uniformity of the input distribution**.

If the input is heavily skewed (for example, all elements cluster tightly around $0.5$), all $n$ elements fall into a single bucket. Sorting that single bucket with insertion sort causes overall runtime to collapse to quadratic **$O(n^2)$ worst-case time**.

When distribution is unknown, comparison sorts like merge sort provide safer worst-case guarantees.

From an algorithmic engineering perspective, understanding the precise operational characteristics of bucket sort for uniform distributions allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Skewed or non-uniform inputs cause all elements to fall into one bucket, collapsing performance to O(n^2).
- Ensure floating point bucket index calculations do not exceed array bounds.

## Remember

- Partitions uniformly distributed continuous values into k buckets.
- Achieves expected O(n) linear time on uniform distributions.
- Degrades to O(n^2) worst-case under severe input clustering.
