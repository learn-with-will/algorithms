---
id: lesson-08
slug: elementary-sorting
title: "Elementary Sorting: Bubble, Selection, Insertion"
level: beginner
order: 8
duration: 28
tags:
  - sorting
  - insertion-sort
  - selection-sort
  - bubble-sort
  - stability
---

# Learning Objectives

By the end of this lesson you will be able to:

- Implement bubble, selection, and insertion sort and trace each.
- Define **stability** and **in-place**, and say which of the three has each property.
- Explain why all three are `Θ(n²)` in the worst case, and when the best case is `O(n)`.
- Justify why **insertion sort** is the one you will actually use — on small or nearly-sorted data.
- Know that Python's built-in sort (Timsort) is the right choice for real work.

# Why This Concept Exists

Sorting is the most-studied problem in computing because so much else gets easier once
data is ordered: searching becomes `O(log n)`, duplicates and medians become trivial, and
merging is linear. The three elementary sorts are `O(n²)`, so you will not use them on
large inputs — but they are the perfect place to learn the vocabulary (stable, in-place,
best/worst case) and the loop-invariant reasoning that the faster sorts build on. And one
of them, insertion sort, is genuinely used in production as the fast path for tiny
subarrays inside `O(n log n)` sorts.

# Concept Explanation

### Two properties that classify every sort

- **Stable** — equal elements keep their original relative order. This matters when you
  sort records by one field and want ties to preserve a previous ordering.
- **In-place** — uses only `O(1)` extra memory, rearranging within the input array.

### Bubble sort

Repeatedly walk the array, swapping adjacent elements that are out of order. After each
pass the largest remaining element "bubbles" to its final position at the end. With an
**early-exit flag** (stop when a pass makes no swaps), an already-sorted array costs
`O(n)`; otherwise it is `Θ(n²)`. Stable and in-place, but it does many swaps and is the
slowest of the three in practice.

### Selection sort

Repeatedly find the **minimum** of the unsorted portion and swap it into the next
position. It always scans the rest of the array to find the minimum, so it is `Θ(n²)`
comparisons *even on sorted input* — there is no best-case speedup. Its one virtue: it
performs only `O(n)` swaps, which helps when writes are far more expensive than reads. The
usual swap-based version is **not stable**.

### Insertion sort

Grow a sorted prefix one element at a time: take the next element (the **key**) and slide
it left past larger elements until it sits in the right place. On already-sorted data each
key is already in place, so it runs in `O(n)`; on reverse-sorted data it is `Θ(n²)`. It is
**stable** and **in-place**, and it is fast on small and nearly-sorted inputs — which is
exactly why real-world sorts switch to it for small subarrays.

```text
insertion sort, inserting the key 2 into sorted prefix [3, 5, 9]:
[3, 5, 9 | 2, ...]   ->  shift 9,5,3 right past 2  ->  [2, 3, 5, 9 | ...]
```

# Key Terminology

- **Stable sort** — preserves the relative order of equal keys.
- **In-place sort** — uses `O(1)` extra space.
- **Comparison sort** — orders elements only by comparing pairs.
- **Pass** — one sweep through the (remaining) array.
- **Key** — the element currently being placed (insertion sort).

# Complexity

| Sort | Best | Average | Worst | Space | Stable? | In-place? |
| ---- | ---- | ------- | ----- | ----- | ------- | --------- |
| Bubble (early-exit) | O(n) | O(n²) | O(n²) | O(1) | Yes | Yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No | Yes |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes | Yes |
| Python `list.sort` (Timsort) | O(n) | O(n log n) | O(n log n) | O(n) | Yes | — |

Selection sort has no best-case speedup; insertion and (optimized) bubble reach `O(n)` on
already-sorted data. All three elementary sorts are in-place with `O(1)` extra space.

# Implementation in Python

```python
def insertion_sort(a: list[int]) -> None:
    """Sort a in place. Invariant: a[0..i-1] is sorted."""
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:   # slide larger elements right
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key                 # drop the key into the gap


def selection_sort(a: list[int]) -> None:
    n = len(a)
    for i in range(n):
        m = i
        for j in range(i + 1, n):      # find min of the unsorted part
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]        # one swap per outer step


def bubble_sort(a: list[int]) -> None:
    n = len(a)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:                # already sorted -> O(n) best case
            break
```

# Real World Analogy

Insertion sort is exactly how most people **sort a hand of playing cards**. You pick up
cards one at a time, and each new card you slide into its correct spot among the cards
already in your hand, shifting the others over to make room. The cards in your hand stay
sorted at every step — that is the loop invariant — and if the cards arrive nearly in
order, you barely have to shift anything, which is the `O(n)` best case.

# Examples

## Example 1 — Basic: insertion sort with its invariant

```python
a = [5, 2, 4, 1]
insertion_sort(a)   # [1, 2, 4, 5]
```

```text
i=1: key=2  [2, 5, 4, 1]     (2 slides left past 5)
i=2: key=4  [2, 4, 5, 1]     (4 slides past 5)
i=3: key=1  [1, 2, 4, 5]     (1 slides to the front)
```

**Why this is good:** the invariant — `a[0..i-1]` is always sorted — makes correctness
clear at every step, and the trace shows why nearly-sorted input needs few shifts.

## Example 2 — Real-world: selection sort minimizes writes

```python
a = [29, 10, 14, 37, 13]
selection_sort(a)   # [10, 13, 14, 29, 37]  -- exactly n-1 swaps
```

**Why this is good:** selection sort does `Θ(n²)` *comparisons* but only `O(n)` *swaps*.
When each write is expensive (e.g. writing to flash memory or moving large records),
minimizing writes can matter more than minimizing comparisons.

## Example 3 — Best practice / edge case: just use the built-in

```python
data = [5, 2, 4, 1]
data.sort()                       # in place, Timsort, O(n log n), stable
ordered = sorted(data)            # returns a new sorted list

records = [("bob", 2), ("amy", 2), ("cid", 1)]
records.sort(key=lambda r: r[1])  # stable: ties keep ("bob") before ("amy")
```

**Why this is good:** Python's Timsort is `O(n log n)`, stable, and adaptive (it exploits
existing runs, so nearly-sorted input approaches `O(n)`). For real work, reach for
`sort`/`sorted`; write the elementary sorts only to learn or when you truly need a tiny
in-place routine.

# Common Mistakes

- **Using an `O(n²)` sort on large inputs.** They are for learning and for tiny arrays;
  use Timsort (or merge/quick/heap sort) for anything sizable.
- **Assuming selection sort is stable.** The standard swap-based version is *not* stable.
- **Claiming bubble sort's best case is `O(n)` without the early-exit flag.** Without it,
  even a sorted array takes `Θ(n²)` passes.
- **Off-by-one bounds.** The inner loops must stop before running off the array; trace a
  4-element input to check.

# Best Practices

- Reach for `list.sort`/`sorted` in real code; only hand-write a sort to learn or for a
  provably tiny, hot subarray.
- If you must hand-write one, choose **insertion sort** — simplest, stable, and `O(n)` on
  nearly-sorted data.
- State the loop invariant for whichever sort you write; it is the quickest correctness check.
- Know your data: nearly-sorted favors insertion/Timsort; expensive writes favor selection.

# Summary

- Bubble, selection, and insertion sort are all `Θ(n²)` worst case and in-place (`O(1)` space).
- Stable = equal keys keep order (bubble and insertion are; selection is not).
- Insertion and early-exit bubble reach `O(n)` on already-sorted data; selection never does.
- Insertion sort is the practical elementary sort — used for small subarrays inside faster sorts.
- For real work, Python's Timsort (`list.sort`) is `O(n log n)`, stable, and adaptive.

# Flash Cards

Q: What does it mean for a sort to be stable?
A: Equal elements keep their original relative order after sorting.

Q: What does it mean for a sort to be in-place?
A: It uses only O(1) extra memory, rearranging elements within the input array.

Q: Which elementary sort runs in O(n) on already-sorted input, and which never speeds up?
A: Insertion sort (and early-exit bubble sort) is O(n) on sorted input; selection sort is Θ(n²) regardless.

Q: Is selection sort stable?
A: No — the standard swap-based selection sort is not stable.

Q: Why is insertion sort used inside faster sorts like Timsort and introsort?
A: It is simple, in-place, stable, and very fast on the small, nearly-sorted subarrays those algorithms produce.

Q: What sorting algorithm does Python's list.sort use, and what are its guarantees?
A: Timsort — O(n log n) worst case, stable, and adaptive to existing runs.

# Exercises

### Easy
Trace `selection_sort([3, 1, 2])` by hand, listing the array after each swap and the
number of comparisons made.

### Medium
Modify `insertion_sort` to sort in *descending* order, and confirm it is still stable.
Which comparison do you change, and why does the stability argument still hold?

### Challenging
Insertion sort's cost equals the number of **inversions** (out-of-order pairs) in the
input. Explain why, and use that to argue insertion sort runs in `O(n + I)` time where `I`
is the inversion count — hence `O(n)` when the array is nearly sorted.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 2
  (insertion sort and its loop invariant), Section 8.1 (the comparison-sort lower bound).
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 2.1 ("Elementary Sorts").
- Python — [Timsort / `list.sort`](https://docs.python.org/3/howto/sorting.html) and the
  guarantee that it is stable.
