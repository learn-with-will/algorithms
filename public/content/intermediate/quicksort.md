---
id: lesson-11
slug: quicksort
title: "Quicksort"
level: intermediate
order: 11
duration: 30
tags:
  - quicksort
  - partition
  - divide-and-conquer
  - randomization
  - sorting
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain quicksort as divide-and-conquer built around a **partition** step.
- Implement partitioning (Lomuto scheme) and quicksort.
- Explain why quicksort is `O(n log n)` on average but `O(n²)` in the worst case.
- Describe how **randomization** or median-of-three defeats the worst case in practice.
- Compare quicksort with merge sort and know why it is the common in-memory default.

# Why This Concept Exists

Merge sort guarantees `O(n log n)` but pays with `O(n)` extra memory and a merge that does
not use the cache especially well. **Quicksort** is the other great comparison sort: it
sorts **in place** and, in practice, is often the fastest general-purpose sort because its
inner loop — the partition — is tight and cache-friendly. The catch is that its
performance depends on how well the pivot splits the data, so understanding partitioning
and pivot choice is the key to using it safely.

# Concept Explanation

### The idea: partition, then recurse

Quicksort is divide-and-conquer, but it does its real work in the **divide** step:

1. **Divide** — choose a **pivot** element and **partition** the array so that everything
   less than the pivot comes before it and everything greater comes after. The pivot is now
   in its final sorted position.
2. **Conquer** — recursively quicksort the left part (< pivot) and the right part (> pivot).
3. **Combine** — nothing to do! Because partitioning places elements on the correct side,
   once both sides are sorted the whole array is sorted.

### Partitioning (Lomuto scheme)

Lomuto partitioning takes the last element as the pivot and scans the array, keeping a
boundary `i` such that everything before it is `≤ pivot`. Each element `≤ pivot` is swapped
to the boundary; finally the pivot is swapped into position `i`.

```text
partition [7, 2, 1, 6, 8, 5 | pivot=5]:
scan, moving elements <=5 to the front, then place pivot:
-> [2, 1 | 5 | 7, 6, 8]     (5 is now in its final spot; sides not yet sorted)
```

### Why the worst case is O(n²)

Partitioning is `Θ(n)`. If the pivot splits the array evenly each time, the recurrence is
`T(n) = 2T(n/2) + Θ(n) = Θ(n log n)`. But if the pivot is always the smallest or largest
element — which happens on already-sorted input with a naive last-element pivot — one side
has `n-1` elements and the other has `0`. Then `T(n) = T(n-1) + Θ(n) = Θ(n²)`, and the
recursion is `n` deep, risking a stack overflow too.

### Average case and randomization

Averaged over all pivot choices, the splits are "good enough" often enough that quicksort
is `Θ(n log n)` **expected** time. To avoid the worst case on real (often already-sorted)
data, use a **randomized pivot** (pick a random element) or **median-of-three** (median of
first, middle, last). Randomization makes the `O(n²)` case astronomically unlikely
regardless of input — no particular input is bad.

### Stability

The standard in-place quicksort is **not stable**: partition swaps can reorder equal
elements. If you need stability, use merge sort.

# Key Terminology

- **Pivot** — the element partitioning is organized around; ends up in its final position.
- **Partition** — rearrange so smaller elements precede the pivot and larger ones follow.
- **Lomuto / Hoare** — two classic partition schemes.
- **Randomized quicksort** — pick the pivot at random to avoid worst-case inputs.
- **In-place** — quicksort sorts within the array, `O(log n)` stack aside.

# Complexity

| Case | Time | Notes |
| ---- | ---- | ----- |
| Best / average | Θ(n log n) | balanced-enough partitions |
| Worst | Θ(n²) | pivot always extreme (e.g. sorted input, naive pivot) |
| Space | O(log n) | recursion stack (average); O(n) stack in the worst case |
| Stable? | No | in-place partition reorders equal keys |

# Implementation in Python

```python
import random

def quicksort(a: list[int], lo: int = 0, hi: int | None = None) -> None:
    """Sort a[lo..hi] in place."""
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:                       # base case: 0 or 1 element
        return
    p = partition(a, lo, hi)           # p is the pivot's final index
    quicksort(a, lo, p - 1)            # sort the smaller side
    quicksort(a, p + 1, hi)            # sort the larger side


def partition(a: list[int], lo: int, hi: int) -> int:
    # Randomized pivot: swap a random element to the end, then use Lomuto.
    r = random.randint(lo, hi)
    a[r], a[hi] = a[hi], a[r]
    pivot = a[hi]
    i = lo                             # boundary: a[lo..i-1] <= pivot
    for j in range(lo, hi):
        if a[j] <= pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]          # put pivot in its final place
    return i
```

# Real World Analogy

Quicksort is like **sorting a pile of numbered files by repeatedly picking a "splitter"**.
You grab one file's number as the pivot, then make two piles: everything below it and
everything above. The splitter is now in its correct spot forever. You repeat on each
smaller pile. If you happen to pick a middling number each time, the piles halve nicely; if
you keep picking the smallest file, you barely make progress — which is why you pick the
splitter at random.

# Examples

## Example 1 — Basic: partition places the pivot

```python
a = [7, 2, 1, 6, 8, 5]
p = partition(a, 0, len(a) - 1)
# after: everything left of index p <= a[p] <= everything right of p
```

**Why this is good:** it isolates the one idea that makes quicksort work — after a
partition, the pivot is in its **final** position and never moves again. All the sorting is
just repeated partitioning.

## Example 2 — Real-world: quickselect (find the k-th smallest)

```python
def quickselect(a: list[int], k: int) -> int:
    """Return the k-th smallest element (0-indexed), average O(n)."""
    lo, hi = 0, len(a) - 1
    while True:
        p = partition(a, lo, hi)
        if p == k:
            return a[p]
        elif p < k:
            lo = p + 1        # recurse into one side only
        else:
            hi = p - 1
```

**Why this is good:** because partitioning tells you the pivot's final rank, you can find
the k-th smallest element without fully sorting — recursing into just **one** side gives
`O(n)` average time. Quickselect is the partition idea applied to selection.

## Example 3 — Best practice / edge case: why randomize the pivot

```text
Sorted input [1, 2, 3, 4, 5] with pivot = last element:
partition -> pivot 5 is largest, left side has 4 elements, right side 0
next -> pivot 4 largest again ... -> Θ(n²) and recursion n deep

Randomized pivot: expected Θ(n log n) on ANY input, sorted or not.
```

**Why this is good:** it shows the exact input that breaks naive quicksort and the fix.
Randomizing the pivot means no particular input is the worst case, which is why production
quicksorts randomize or use median-of-three.

# Common Mistakes

- **Naive last-element pivot on sorted data** → `Θ(n²)` and deep recursion. Randomize or
  use median-of-three.
- **Expecting stability.** In-place quicksort is not stable; use merge sort if ties must
  keep order.
- **Recursing on the wrong bounds.** After partition, recurse on `[lo, p-1]` and `[p+1, hi]`
  — excluding the pivot, which is already placed.
- **Unbounded worst-case recursion depth.** To cap stack depth at `O(log n)`, recurse into
  the smaller side and loop on the larger (tail-call elimination by hand).

# Best Practices

- **Randomize the pivot** (or use median-of-three) to avoid worst-case inputs.
- Use quicksort when you want an **in-place** sort and average-case speed, and stability is
  not required.
- Switch to **insertion sort** for tiny subarrays — real implementations (introsort) do.
- Reach for `quickselect` when you need an order statistic (median, k-th smallest) without
  a full sort.

# Summary

- Quicksort partitions around a pivot, then recurses on each side; the combine step is free.
- Partitioning is `Θ(n)`; balanced pivots give `Θ(n log n)`, extreme pivots give `Θ(n²)`.
- Randomized (or median-of-three) pivots make the worst case negligible in practice.
- Quicksort is **in-place** and fast but **not stable**; merge sort is stable but uses `O(n)` space.
- The partition idea also yields **quickselect**, finding the k-th smallest in `O(n)` average.

# Flash Cards

Q: What does the partition step guarantee about the pivot?
A: After partitioning, the pivot is in its final sorted position, with smaller elements before it and larger ones after.

Q: What is quicksort's average and worst-case time?
A: Θ(n log n) average, Θ(n²) worst case (when the pivot is repeatedly the smallest or largest element).

Q: Why does naive quicksort degrade to Θ(n²) on already-sorted input?
A: A last-element pivot is always the largest, producing maximally unbalanced partitions of sizes n-1 and 0.

Q: How is quicksort's worst case avoided in practice?
A: Choose the pivot randomly (or by median-of-three), so no specific input is the worst case.

Q: Is quicksort stable?
A: No — the in-place partition swaps can reorder equal elements; use merge sort for stability.

Q: What problem does quickselect solve, and in what average time?
A: Finding the k-th smallest element (an order statistic) in O(n) average time by recursing into only one partition side.

# Exercises

### Easy
Trace one call to `partition([3, 8, 2, 5, 1], 0, 4)` with pivot = last element (1), listing
each swap and the returned pivot index.

### Medium
Explain, using the recurrence, why quicksort is `Θ(n log n)` when every partition splits the
array in half, and `Θ(n²)` when every partition peels off a single element.

### Challenging
Implement quicksort so its worst-case **recursion depth** is `O(log n)`: after partitioning,
recurse into the smaller side and iterate (loop) on the larger side. Explain why this bounds
the stack even though the time can still be `Θ(n²)`.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 7
  ("Quicksort"), including randomized quicksort and its analysis; Chapter 9 (medians and
  order statistics / quickselect).
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 2.3 ("Quicksort").
- Python — quicksort is not the library sort (that is Timsort); this lesson is for
  understanding, not for replacing `list.sort`.
