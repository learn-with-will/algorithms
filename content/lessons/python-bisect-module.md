---
slug: python-bisect-module
title: "Python's bisect Module"
topic: recursion-and-searching
kind: tool
summary: "The standard library bisect module provides tested C-speed binary insertion and lookup functions."
tags: ["bisect", "python-standard-library", "binary-search", "tools"]
related: ["binary-search-algorithm", "binary-search-off-by-one-traps", "binary-search-on-answer-spaces"]
---
> **In one line:** Python's bisect module provides tested, high-performance binary search primitives in the standard library.

## The idea

Rather than handwriting binary search and risking off-by-one errors, Python developers rely on the standard library `bisect` module.

The module provides four primary functions for sorted sequences:

| Function | Behavior | Return Index on Duplicates |
|---|---|---|
| `bisect_left(a, x)` | Finds insertion index for $x$ | First position where `item >= x` (leftmost insertion). |
| `bisect_right(a, x)` / `bisect(a, x)` | Finds insertion index for $x$ | First position where `item > x` (rightmost insertion). |
| `insort_left(a, x)` | Inserts $x$ into sorted list in-place | Maintains sorted order with leftmost insertion. |
| `insort_right(a, x)` | Inserts $x$ into sorted list in-place | Maintains sorted order with rightmost insertion. |

Because `bisect` is implemented in compiled C, it executes significantly faster than pure Python while guaranteeing zero off-by-one errors.

## See it

Using bisect for exact matches, range queries, and grade lookup:

```python
import bisect

arr = [10, 20, 20, 20, 30, 40]

# bisect_left finds the FIRST index of 20
idx_left = bisect.bisect_left(arr, 20)
print("bisect_left for 20:", idx_left)    # Output: 1

# bisect_right finds index AFTER the last 20
idx_right = bisect.bisect_right(arr, 20)
print("bisect_right for 20:", idx_right)  # Output: 4

# Grading table lookup using bisect:
breakpoints = [60, 70, 80, 90]
grades = ['F', 'D', 'C', 'B', 'A']
def grade(score: int) -> str:
    return grades[bisect.bisect_right(breakpoints, score)]

print([grade(s) for s in [55, 65, 82, 95]])  # ['F', 'D', 'B', 'A']
```

## Go deeper

In Python 3.10+, `bisect` added the `key=` parameter, enabling binary search over lists of complex objects without extracting keys into auxiliary arrays:
```python
records = [{'id': 1, 'score': 72}, {'id': 2, 'score': 95}]
idx = bisect.bisect_left(records, 80, key=lambda r: r['score'])
```
This is invaluable for searching database records or log entries sorted by timestamp.

From an algorithmic engineering perspective, understanding the precise operational characteristics of python's bisect module allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Remember that while bisect locates the insertion index in O(log n), insort() takes O(n) because inserting into a list shifts elements.
- bisect assumes the input sequence is sorted; passing an unsorted list produces garbage output.

## Remember

- bisect_left finds the lower bound; bisect_right finds the upper bound.
- Use bisect for interval lookups, range counting, and sorted insertion.
- Supports key= arguments in modern Python for searching records.
