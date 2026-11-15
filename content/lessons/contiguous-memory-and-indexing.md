---
slug: contiguous-memory-and-indexing
title: "Contiguous Memory and Constant-Time Indexing"
topic: linear-data-structures
kind: concept
summary: "Arrays store elements in consecutive memory addresses, enabling O(1) random access via arithmetic offset calculation."
tags: ["arrays", "memory-layout", "indexing", "random-access"]
related: ["dynamic-array-geometric-growth", "array-insertion-and-deletion-costs", "singly-linked-list-nodes"]
---
> **In one line:** Arrays guarantee O(1) random access because element memory addresses are computed by direct pointer arithmetic.

## The idea

An **array** is the most foundational data structure in computer science. It stores a fixed-size sequence of elements in **contiguous memory locations** — consecutive physical byte addresses in RAM.

Because all elements occupy consecutive slots of identical byte width $w$, locating the element at index $i$ requires no traversal. The CPU calculates the physical memory address in a single arithmetic instruction:

$$\text{address}(A[i]) = \text{base\_address} + (i \times w)$$

| Property | Value | Architectural Impact |
|---|---|---|
| **Access Time** | $O(1)$ | Direct pointer calculation; instantaneous access to any valid index. |
| **Locality of Reference** | Outstanding | Adjacent elements are fetched into the CPU L1/L2 cache lines simultaneously. |
| **Memory Overhead** | Minimal | Zero pointer storage overhead; pure sequential payload storage. |
| **Resizing Cost** | Fixed | Fixed-size arrays cannot expand in place without reallocation. |

This hardware-level memory locality is why arrays consistently outperform pointer-based structures on modern multi-core processors.

## See it

Direct constant-time element access by index in Python:

```python
# In Python, list elements are contiguous arrays of pointer addresses
elements = [10, 20, 30, 40, 50]

# O(1) indexing: directly fetches element at index 3
val = elements[3]
print(f"Value at index 3: {val}")  # Output: 40

# Reading first, middle, or last item takes identical constant time
print(elements[0], elements[len(elements) // 2], elements[-1])
```

## Go deeper

In languages like C, array elements themselves are stored inline consecutively. In CPython, a `list` is implemented internally as an array of pointers (`PyObject**`), each pointing to the actual heap-allocated object.

Even though Python objects are scattered across heap memory, the array of pointers itself is strictly contiguous. As a result, reading `arr[i]` requires computing the pointer offset in $O(1)$ and dereferencing the pointer in $O(1)$, preserving the fundamental constant-time random access contract.

From an algorithmic engineering perspective, understanding the precise operational characteristics of contiguous memory and constant-time indexing allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Do not assume array search is O(1); locating a specific value in an unsorted array requires a linear O(n) scan.
- Index lookup beyond array bounds raises IndexError in Python and undefined memory faults in C.

## Remember

- Contiguous memory layout enables instantaneous O(1) address calculation.
- Array memory addresses follow the formula: base + (index * element_size).
- Hardware CPU cache line prefetching heavily favors contiguous array structures.
