---
slug: radix-sort-lsd-and-msd
title: "Radix Sort: Digit-by-Digit Distribution"
topic: sorting-algorithms
kind: technique
summary: "Sort fixed-width keys in O(d * (n + k)) time by repeatedly applying stable counting sort from least significant digit."
tags: ["radix-sort", "non-comparison", "digits", "linear-time"]
related: ["counting-sort-algorithm", "bucket-sort-distribution", "when-to-use-non-comparison-sorts"]
---
> **In one line:** Radix sort sorts numbers digit-by-digit from least to most significant using stable counting sort passes.

## The idea

**Radix sort** sorts integers or fixed-length strings with $d$ digits by sorting them digit-by-digit.

The standard **Least Significant Digit (LSD)** variant sorts starting from the 1s digit, then 10s, then 100s:
1. Sort elements by their least significant digit using a **stable** sort (typically Counting Sort with base $b = 10$).
2. Repeat the process for the next digit position to the left.
3. After sorting on the most significant digit, the entire array is completely sorted!

```flow
p1: Pass 1 (1s digit) | stably sort by units digit @blue
p2: Pass 2 (10s digit) | stably sort by tens digit @blue
p3: Pass 3 (100s digit) | stably sort by hundreds digit @green
p1 -> p2
p2 -> p3
```

Because each pass takes $O(n + b)$ time, $d$ passes require **$O(d \cdot (n + b))$ total time**.

## See it

LSD Radix sort implementation on non-negative integers:

```python
def radix_sort(arr: list[int]) -> list[int]:
    if not arr:
        return []
    max_val = max(arr)
    exp = 1  # 1s digit, 10s digit, 100s digit...
    
    while max_val // exp > 0:
        # Stable counting sort by digit: (num // exp) % 10
        output = [0] * len(arr)
        count = [0] * 10
        for num in arr:
            digit = (num // exp) % 10
            count[digit] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        for num in reversed(arr):
            digit = (num // exp) % 10
            output[count[digit] - 1] = num
            count[digit] -= 1
        arr = output
        exp *= 10
    return arr

vals = [170, 45, 75, 90, 802, 24, 2, 66]
print("Sorted:", radix_sort(vals))  # [2, 24, 45, 66, 75, 90, 170, 802]
```

## Go deeper

Why must the intermediate sort be **stable**?

When sorting on the 10s digit, if two numbers have identical 10s digits (e.g. `124` and `129`), their relative order must remain determined by their 1s digits (which were sorted in the previous pass). If the sorting pass were unstable, the work done by previous digit passes would be corrupted.

In binary systems, treating numbers as base $2^{16}$ (65536) sorts 64-bit integers in exactly 4 passes, drastically outperforming comparison sorts on large arrays.

From an algorithmic engineering perspective, understanding the precise operational characteristics of radix sort: digit-by-digit distribution allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- The underlying intermediate sorting pass must be stable, or Radix sort fails completely.
- Handling negative numbers requires either shifting numbers by an offset or sorting signs in a separate pass.

## Remember

- Radix sort processes keys digit-by-digit across d passes.
- Relies fundamentally on the stability of the intermediate counting sort.
- Runs in linear O(d * (n + b)) time for fixed-width keys.
