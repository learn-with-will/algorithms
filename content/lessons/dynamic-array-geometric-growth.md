---
slug: dynamic-array-geometric-growth
title: "Dynamic Array Geometric Growth"
topic: linear-data-structures
kind: technique
summary: "Dynamic arrays double capacity when full to maintain amortized O(1) append performance across sequence growth."
tags: ["dynamic-array", "amortized", "resizing", "python-list"]
related: ["contiguous-memory-and-indexing", "array-insertion-and-deletion-costs", "preallocating-and-building-arrays"]
---
> **In one line:** Geometric resizing doubles capacity to guarantee amortized O(1) appends over long sequences.

## The idea

Fixed-size arrays cannot grow when their capacity is exhausted. A **dynamic array** (such as Python's `list`, C++'s `std::vector`, or Java's `ArrayList`) overcomes this limitation by wrapping a fixed-size array and managing reallocations transparently.

When an append occurs and the current backing array is full:
1. A new, larger contiguous memory block is allocated.
2. All existing $n$ elements are copied into the new storage buffer.
3. The old memory buffer is released back to the system.
4. The new element is appended, and the array pointer is updated.

| Resizing Strategy | Resizing Work for $n$ Appends | Amortized Cost per Append |
|---|---|---|
| **Arithmetic (+c)** | $O(n^2)$ | $O(n)$ — quadratic disaster |
| **Geometric ($\times 2$)** | $O(n)$ | $O(1)$ — optimal scalability |

Geometric expansion ensures that reallocation happens exponentially less frequently as the array grows.

## See it

Tracking internal capacity changes during dynamic append operations:

```python
import sys

items = []
last_size = sys.getsizeof(items)

print(f"{'Length':<8} | {'Bytes':<10} | {'Status'}")
print("-" * 32)
for i in range(15):
    items.append(i)
    current_size = sys.getsizeof(items)
    status = "REALLOCATED" if current_size != last_size else "in-place"
    print(f"{len(items):<8} | {current_size:<10} | {status}")
    last_size = current_size
```

## Go deeper

CPython uses a specialized geometric growth formula to balance memory fragmentation against reallocation frequency:
$$\text{new\_capacity} = n + (n \gg 3) + (3 \text{ if } n < 9 \text{ else } 6)$$
This growth factor is approximately $1.125$, smaller than the textbook doubling factor ($2.0$). 

The theoretical principle remains unchanged: multiplying capacity by any constant factor greater than $1$ guarantees that the total work across $n$ insertions forms a convergent geometric progression, preserving amortized $O(1)$ append performance.

From an algorithmic engineering perspective, understanding the precise operational characteristics of dynamic array geometric growth allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- A single append operation that triggers reallocation takes O(n) worst-case time, which can introduce latency spikes.
- Growing an array by adding a constant fixed number of slots produces disastrous quadratic O(n^2) cumulative runtime.

## Remember

- Dynamic arrays reallocate and copy elements when internal capacity is exhausted.
- Geometric capacity multiplication guarantees amortized O(1) appends.
- CPython uses an optimized growth ratio (~1.125) to mitigate memory over-allocation.
