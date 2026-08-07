---
id: lesson-10
slug: divide-and-conquer-merge-sort
title: "Divide and Conquer and Merge Sort"
level: intermediate
order: 10
duration: 30
tags:
  - divide-and-conquer
  - merge-sort
  - recurrence
  - sorting
  - stable
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the three steps of the **divide-and-conquer** paradigm.
- Implement **merge sort** and its linear-time **merge** step.
- Explain why merge sort is `Θ(n log n)` in *all* cases via its recurrence.
- Say why merge sort is **stable** but **not in-place** (`O(n)` extra space).
- Recognize when merge sort is the right choice (linked lists, external sorting, stability).

# Why This Concept Exists

The elementary sorts are `O(n²)` because each element interacts with every other. **Divide
and conquer** breaks that quadratic barrier by splitting a problem into independent pieces,
solving each, and cheaply combining the results. Merge sort applies it to sorting and
achieves a *guaranteed* `Θ(n log n)` — no bad inputs, ever — while remaining stable. It is
also the natural sort for data you cannot randomly access (linked lists) or cannot fit in
memory (external, on-disk sorting), because it only ever merges sequential streams.

# Concept Explanation

### The divide-and-conquer paradigm

Divide and conquer solves a problem in three steps:

1. **Divide** the problem into smaller subproblems of the same kind.
2. **Conquer** each subproblem by solving it recursively (the base case is a subproblem so
   small it is solved directly).
3. **Combine** the subproblem solutions into a solution for the original.

### Merge sort

Merge sort is divide and conquer for sorting:

1. **Divide** the array into two halves.
2. **Conquer** by sorting each half recursively (a subarray of length ≤ 1 is already sorted).
3. **Combine** by **merging** the two sorted halves into one sorted array.

```text
            [5, 2, 4, 7, 1, 3]
           /                   \
      [5, 2, 4]              [7, 1, 3]        divide
      /      \               /      \
   [5]    [2, 4]          [7]     [1, 3]
           /  \                    /   \
        [2]   [4]                [1]   [3]
   ---- merge back up, always producing sorted runs ----
      [2, 4, 5]              [1, 3, 7]
           \                   /
            [1, 2, 3, 4, 5, 7]                 combine
```

### The merge step

Merging two sorted lists is linear: walk a pointer through each, repeatedly taking the
smaller front element. It needs an auxiliary array to write into — this is why merge sort
is **not in-place**. To keep the sort **stable**, on a tie take from the **left** half
first, preserving the original order of equal elements.

### Why Θ(n log n) — the recurrence

Let `T(n)` be merge sort's running time. It makes two recursive calls on halves and does
`Θ(n)` work to merge:

```text
T(n) = 2·T(n/2) + Θ(n)
```

Picture the recursion tree: it has `log₂ n` levels (halving until size 1), and every level
does `Θ(n)` total merging work. So `T(n) = Θ(n log n)`. This holds for **every** input —
best, average, and worst case are all `Θ(n log n)`. (This is the Master Theorem's "balanced"
case: `T(n) = aT(n/b) + f(n)` with `a = b = 2` and `f(n) = Θ(n)`.)

# Key Terminology

- **Divide and conquer** — divide, conquer recursively, combine.
- **Merge** — combine two sorted sequences into one in linear time.
- **Recurrence** — `T(n) = 2T(n/2) + Θ(n)` for merge sort.
- **Stable** — equal elements keep their relative order (merge sort is, with left-first ties).
- **Auxiliary space** — the extra `O(n)` array the merge writes into.

# Complexity

| Property | Value |
| -------- | ----- |
| Time (best / average / worst) | Θ(n log n) — all cases |
| Space | O(n) auxiliary (not in-place) |
| Stable? | Yes |
| Recurrence | T(n) = 2T(n/2) + Θ(n) |

Merge sort's guaranteed worst case is its headline advantage over quicksort, which can
degrade to `O(n²)`.

# Implementation in Python

```python
def merge_sort(a: list[int]) -> list[int]:
    if len(a) <= 1:                     # base case
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])          # conquer left
    right = merge_sort(a[mid:])         # conquer right
    return merge(left, right)           # combine


def merge(left: list[int], right: list[int]) -> list[int]:
    result: list[int] = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:         # <= keeps it STABLE (left wins ties)
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])             # append whichever side has leftovers
    result.extend(right[j:])
    return result
```

# Real World Analogy

Merge sort is how two people **merge two already-sorted stacks of graded exams** into one
sorted pile. Each holds a sorted stack; they repeatedly compare the top two papers and put
the lower one down. Because both stacks are already ordered, one pass through them produces
a fully sorted pile — the linear-time merge. The "divide" part is just handing each half of
the class to a helper who sorts it the same way.

# Examples

## Example 1 — Basic: merging two sorted lists

```python
merge([1, 4, 7], [2, 3, 8])   # [1, 2, 3, 4, 7, 8]
```

```text
left=[1,4,7] right=[2,3,8]
take 1 (left)  -> [1]
take 2 (right) -> [1,2]
take 3 (right) -> [1,2,3]
take 4 (left)  -> [1,2,3,4]  ... then 7, 8
```

**Why this is good:** the merge is the heart of the algorithm. Each comparison emits one
element, so merging total `n` elements is `Θ(n)` — the per-level cost that makes the whole
sort `Θ(n log n)`.

## Example 2 — Real-world: sorting records stably

```python
people = [("bob", 30), ("amy", 25), ("cid", 30)]
by_age = merge_sort_by(people, key=lambda p: p[1])
# [("amy",25), ("bob",30), ("cid",30)]  -- bob stays before cid (stable)
```

**Why this is good:** stability lets you sort by successive keys and have earlier orderings
survive ties. Sorting by age keeps `bob` before `cid` because that was their original order
— exactly the behaviour you want when sorting multi-field records.

## Example 3 — Best practice / edge case: guaranteed worst case

```text
Merge sort on an adversarial input (e.g. reverse-sorted): still Θ(n log n).
Quicksort on the same input with a naive pivot: can be Θ(n²).
```

**Why this is good:** merge sort's bound does not depend on the input distribution, so it is
the safe choice when you need a hard `O(n log n)` guarantee — sorting untrusted input, or
meeting a real-time deadline — even though it costs `O(n)` extra memory.

# Common Mistakes

- **Forgetting the leftover elements.** After the main loop, one side still has sorted
  elements to append (`result.extend(...)`). Dropping them corrupts the output.
- **Breaking stability.** Using `<` instead of `<=` (taking from the right on ties) makes
  the sort unstable.
- **Believing merge sort is in-place.** The standard array version needs `O(n)` auxiliary
  space; do not claim `O(1)`.
- **Re-slicing excessively.** `a[:mid]` copies; for teaching it is fine, but high-performance
  implementations merge using indices into a shared buffer.

# Best Practices

- Keep the merge **stable** with `<=` (left half wins ties).
- Use merge sort when you need a **guaranteed** `O(n log n)`, **stability**, or you are
  sorting a **linked list** or **external** data.
- For general in-memory sorting in Python, use Timsort (`sorted`) — itself a refined,
  adaptive merge sort.
- Analyze divide-and-conquer algorithms by writing and solving their recurrence.

# Summary

- Divide and conquer = divide into subproblems, conquer recursively, combine.
- Merge sort divides in half, sorts each half, and merges in linear time.
- Its recurrence `T(n) = 2T(n/2) + Θ(n)` gives `Θ(n log n)` in **all** cases.
- It is **stable** (with left-first ties) but **not in-place** — `O(n)` auxiliary space.
- Choose merge sort for guaranteed performance, stability, linked lists, or external sorts.

# Flash Cards

Q: What are the three steps of divide and conquer?
A: Divide into subproblems, conquer each recursively, and combine their solutions.

Q: What is merge sort's recurrence and the running time it gives?
A: T(n) = 2T(n/2) + Θ(n), which solves to Θ(n log n).

Q: Is merge sort's Θ(n log n) the same in the best, average, and worst case?
A: Yes — merge sort is Θ(n log n) for every input, with no bad-input degradation.

Q: Is merge sort in-place?
A: No — the standard array version needs O(n) auxiliary space for the merge.

Q: How do you keep the merge step stable?
A: On a tie, take from the left half first (use <=), preserving the original order of equal elements.

Q: When is merge sort preferable to quicksort?
A: When you need a guaranteed O(n log n), stability, or you are sorting a linked list or external (on-disk) data.

# Exercises

### Easy
Trace `merge_sort([5, 2, 4, 7, 1])`, showing the divide tree and each merge. How many
levels does the recursion tree have?

### Medium
Rewrite `merge` to detect and count **inversions** (pairs out of order) while merging, so
`merge_sort` also returns the total inversion count in `Θ(n log n)`.

### Challenging
Merge sort adapts perfectly to a singly linked list, where splitting is `O(n)` but no
auxiliary array is needed for the merge. Implement `merge_sort` for a linked list and
explain why it uses only `O(log n)` extra space (the recursion stack) rather than `O(n)`.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 2
  (merge sort) and Chapter 4 (the Master Theorem and solving recurrences).
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 2.2 ("Mergesort").
- Python — [sorting HOWTO](https://docs.python.org/3/howto/sorting.html) (Timsort is an
  adaptive merge sort).
