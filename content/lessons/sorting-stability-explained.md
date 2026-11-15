---
slug: sorting-stability-explained
title: "Sorting Stability Explained"
topic: sorting-algorithms
kind: concept
summary: "A stable sort preserves the original relative order of elements that have equal sorting keys."
tags: ["stability", "sorting", "invariants", "algorithms"]
related: ["bubble-sort-mechanics", "insertion-sort-and-online-processing", "merge-sort-implementation"]
---
> **In one line:** A sort is stable if it preserves the original relative ordering of elements with identical sorting keys.

## The idea

A sorting algorithm is classified as **stable** if whenever two elements have equal keys, their relative order in the output matches their relative order in the original input.

Formally, if $A[i] = A[j]$ with $i < j$, a stable sort places $A[i]$ before $A[j]$ in the final array.

| Algorithm | Stable? | Reason |
|---|---|---|
| **Insertion Sort** | **Yes** | Equal items are never shifted past each other (`>` check). |
| **Merge Sort** | **Yes** | Left subarray element chosen on tie during merge. |
| **Bubble Sort** | **Yes** | Adjacent equal items are never swapped. |
| **Selection Sort** | **No** | Long-distance swaps can leapfrog equal elements. |
| **Quicksort** | **No** | Partitioning swaps keys across long distances. |
| **Heapsort** | **No** | Sift-down moves elements according to heap tree structure. |

Stability is critical when performing multi-pass sorting (such as sorting by last name, then sorting by first name).

## See it

Preserving multi-criteria sort order with stability:

```python
# List of students sorted initially by first name
students = [
    ("Alice", 85),
    ("Bob", 92),
    ("Charlie", 85),
    ("Diana", 92)
]

# Stable sort by score (Python's Timsort is guaranteed stable):
sorted_students = sorted(students, key=lambda s: s[1])

# For score 85, Alice appears before Charlie (matching initial order)
# For score 92, Bob appears before Diana
for student in sorted_students:
    print(student)
```

## Go deeper

Why does stability matter in database engines and spreadsheet tables?

When a user clicks "Sort by Date", then clicks "Sort by Category", they expect rows within the same category to remain sorted by date! A stable sort guarantees this composability; an unstable sort scrambles the earlier ordering.

Radix sort fundamentally relies on stable intermediate sorting passes to correctly sort multi-digit numbers from least to most significant digit.

From an algorithmic engineering perspective, understanding the precise operational characteristics of sorting stability explained allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Never assume a sort is stable unless explicitly guaranteed by its specification.
- Changing > to >= in insertion sort or merge sort destroys stability.

## Remember

- Stable sorts preserve the initial input order of elements with equal keys.
- Insertion sort and merge sort are stable; quicksort and heapsort are unstable.
- Python's built-in sorted() and list.sort() (Timsort) are guaranteed stable.
