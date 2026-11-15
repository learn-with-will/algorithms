---
slug: preallocating-and-building-arrays
title: "Preallocating and Constructing Arrays"
topic: linear-data-structures
kind: pattern
summary: "Construct lists efficiently using preallocation or list comprehensions instead of repeated concatenation."
tags: ["preallocation", "list-comprehension", "patterns", "optimization"]
related: ["dynamic-array-geometric-growth", "array-insertion-and-deletion-costs", "contiguous-memory-and-indexing"]
---
> **In one line:** Preallocate known list sizes with [None] * n or use list comprehensions to avoid repeated resizing.

## The idea

When constructing an array of known size $n$, the technique used to assemble the elements has a dramatic impact on execution speed and memory allocations:

- **Repeated Concatenation (`arr += [x]`):** Creates and discards intermediate list objects on every turn, causing catastrophic $O(n^2)$ copying.
- **Repeated Appends (`arr.append(x)`):** Runs in amortized $O(n)$ time, but still incurs periodic dynamic geometric reallocation and buffer copying.
- **Preallocation (`[None] * n`):** Allocates the exact memory buffer upfront in a single step, enabling direct index assignment `arr[i] = x` with zero reallocations.
- **List Comprehension (`[x for x in ...]`)**: Optimized at the CPython bytecode level with pre-sized buffer heuristics.

> **Tip:** List comprehensions run in optimized C bytecode routines that build lists significantly faster than explicit Python `for` loops calling `.append()`.

## See it

Comparing array initialization approaches:

```python
import time

n = 100_000

# Approach 1: Preallocation with direct index assignment
t0 = time.perf_counter()
preallocated = [0] * n
for i in range(n):
    preallocated[i] = i * 2
t_pre = time.perf_counter() - t0

# Approach 2: List comprehension
t0 = time.perf_counter()
comp = [i * 2 for i in range(n)]
t_comp = time.perf_counter() - t0

print(f"Preallocation:      {t_pre:.4f}s")
print(f"List comprehension:  {t_comp:.4f}s")
```

## Go deeper

The `[None] * n` idiom creates a list of $n$ references pointing to the singleton `None` object.

Because `None` is an immutable singleton, multiplying references is extremely fast and allocates only the pointer table. When building dynamic programming lookup tables or multi-dimensional matrices, preallocation guarantees that internal buffers never resize during state computations, providing predictable memory bounds.

From an algorithmic engineering perspective, understanding the precise operational characteristics of preallocating and constructing arrays allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Never create 2D matrices using [[0] * m] * n; it duplicates the same row reference n times! Use [[0] * m for _ in range(n)].
- Avoid using += to append single items to lists in loops; use .append() instead.

## Remember

- Preallocation with [None] * n allocates contiguous storage in a single operation.
- List comprehensions leverage internal C-level bytecode optimization.
- Use nested list comprehensions when constructing multi-dimensional arrays.
