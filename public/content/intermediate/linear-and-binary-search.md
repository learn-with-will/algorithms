---
id: lesson-09
slug: linear-and-binary-search
title: "Linear and Binary Search"
level: intermediate
order: 9
duration: 26
tags:
  - searching
  - binary-search
  - linear-search
  - bisect
  - logarithmic
---

# Learning Objectives

By the end of this lesson you will be able to:

- Implement linear search and know its `O(n)` cost and generality.
- Implement **binary search** correctly, respecting its **sorted-input precondition**.
- Explain why binary search is `O(log n)` and avoid its classic off-by-one bugs.
- Use Python's `bisect` module for insertion points and membership.
- Apply "binary search on the answer" to monotonic predicates.

# Why This Concept Exists

Finding an element is one of the most frequent operations in all of computing. If the
data is unsorted, you have no choice but to look at everything — linear search, `O(n)`.
But if the data is **sorted**, you can do dramatically better: each comparison lets you
throw away *half* of what remains, so you home in on the answer in `O(log n)` steps. That
is the payoff that makes sorting worthwhile, and binary search is the template for a whole
family of "halving" algorithms — including searching over answers, not just arrays.

# Concept Explanation

### Linear search

Scan from the start until you find the target or run out. It works on **any** sequence,
sorted or not, and is `O(n)`. When data is unsorted or tiny, it is the right tool — no
setup, no preconditions.

### Binary search

Binary search requires the input to be **sorted**. Keep a window `[lo, hi]` that must
contain the target if it is present. Look at the middle element:

- If it equals the target, done.
- If it is smaller, the target can only be to the right → move `lo` past `mid`.
- If it is larger, the target can only be to the left → move `hi` before `mid`.

Each step halves the window, so after `k` steps the window has `n / 2ᵏ` elements. It
empties after about `log₂ n` steps — hence `O(log n)`.

```text
find 7 in [1, 3, 5, 7, 9, 11]        window shrinks by half each step
lo=0 hi=5 mid=2 -> a[2]=5 < 7  -> lo=3
lo=3 hi=5 mid=4 -> a[4]=9 > 7  -> hi=3
lo=3 hi=3 mid=3 -> a[3]=7 == 7  -> found at index 3
```

### The off-by-one minefield

Binary search is famously easy to get *subtly* wrong. The three decisions that must agree:

- The loop condition — with an inclusive window use `while lo <= hi`.
- The midpoint — `mid = (lo + hi) // 2`. (In languages with fixed-width integers,
  `lo + hi` can overflow; the safe form is `lo + (hi - lo) // 2`. Python integers are
  unbounded, so overflow cannot happen here — but the habit is worth keeping.)
- The updates — `lo = mid + 1` and `hi = mid - 1`. Forgetting the `± 1` can loop forever.

### The bisect module

Python's `bisect` module implements binary search over a sorted list:

- `bisect_left(a, x)` — the leftmost index where `x` could be inserted to keep `a` sorted
  (before any equal elements).
- `bisect_right(a, x)` — the rightmost such index (after any equal elements).
- `insort_left/right(a, x)` — insert `x` keeping `a` sorted (the search is `O(log n)`, but
  the list insertion shifts elements, so the whole call is `O(n)`).

# Key Terminology

- **Precondition** — a requirement for correctness; binary search's is *sorted input*.
- **Search window `[lo, hi]`** — the range that still may contain the target.
- **Midpoint** — the index examined each step.
- **Insertion point** — where a value would go to keep a list sorted (`bisect`).
- **Monotonic predicate** — a true/false test that flips once as its argument increases.

# Complexity

| Search | Precondition | Time | Space |
| ------ | ------------ | ---- | ----- |
| Linear search | none | O(n) | O(1) |
| Binary search (iterative) | sorted | O(log n) | O(1) |
| Binary search (recursive) | sorted | O(log n) | O(log n) stack |

# Implementation in Python

```python
def binary_search(a: list[int], target: int) -> int:
    """Return an index of target in sorted list a, or -1 if absent."""
    lo, hi = 0, len(a) - 1        # inclusive window [lo, hi]
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1          # target is to the right
        else:
            hi = mid - 1          # target is to the left
    return -1


import bisect

def contains(a: list[int], x: int) -> bool:
    i = bisect.bisect_left(a, x)          # O(log n)
    return i < len(a) and a[i] == x
```

# Real World Analogy

Binary search is how you find a word in a **paper dictionary**. You do not read from "a";
you open to the middle, see whether your word falls before or after, and repeat on that
half. Doubling the dictionary's size adds just *one* more open-and-check — the logarithmic
magic. But it only works because the dictionary is *sorted*; on a shuffled dictionary you
would be back to reading every page.

# Examples

## Example 1 — Basic: search a sorted list

```python
a = [1, 3, 5, 7, 9, 11]
binary_search(a, 7)    # 3
binary_search(a, 8)    # -1
```

**Why this is good:** it exercises both outcomes and the inclusive-window template. Trace
the `8` case to see the window shrink to empty (`lo > hi`), which is what justifies
returning `-1`.

## Example 2 — Real-world: first element ≥ x with bisect

```python
import bisect

def first_at_least(a: list[int], x: int) -> int | None:
    i = bisect.bisect_left(a, x)     # leftmost insertion point
    return a[i] if i < len(a) else None

prices = [10, 12, 15, 15, 20]
first_at_least(prices, 15)   # 15  (index 2, before the duplicates)
```

**Why this is good:** `bisect_left` solves "smallest value not less than `x`" in
`O(log n)` without a hand-rolled loop, and it handles duplicates predictably by landing
before them. Reaching for `bisect` avoids the off-by-one bugs entirely.

## Example 3 — Best practice / edge case: binary search on the answer

```python
def isqrt(n: int) -> int:
    """Largest r with r*r <= n, via binary search on the answer."""
    lo, hi = 0, n
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if mid * mid <= n:
            lo = mid + 1        # mid is feasible; try larger
        else:
            hi = mid - 1
    return hi                    # hi is the largest feasible value
```

**Why this is good:** there is no array here — we binary-search the *range of possible
answers* using the monotonic predicate "is `mid*mid <= n`?". This "binary search on the
answer" pattern solves many optimization problems in `O(log(range))` and is a direct
generalization of array search.

# Common Mistakes

- **Binary searching unsorted data.** The sorted precondition is mandatory; on unsorted
  input the result is meaningless.
- **Forgetting the `± 1` updates.** `lo = mid` or `hi = mid` can loop forever; use
  `mid + 1` / `mid - 1` with the inclusive window.
- **Inconsistent window and condition.** Mixing an inclusive window with `while lo < hi`
  (or vice versa) causes off-by-one errors. Pick one convention and keep it consistent.
- **Using `insort` in a loop and expecting `O(log n)`.** The search is logarithmic but the
  list insertion is `O(n)`, so building a sorted list this way is `O(n²)`.

# Best Practices

- Confirm (or ensure) the data is **sorted** before binary searching.
- Prefer the `bisect` module over a hand-written loop for insertion points and membership.
- Write `mid = lo + (hi - lo) // 2` as a habit, even though Python cannot overflow.
- Recognize monotonic predicates — many "minimum/maximum feasible value" problems are
  binary search in disguise.

# Summary

- Linear search is `O(n)` and works on any sequence; binary search is `O(log n)` but
  requires **sorted** input.
- Binary search halves the search window each step; keep the window, condition, and `± 1`
  updates consistent to avoid off-by-one bugs.
- `bisect` gives correct `O(log n)` insertion points and membership out of the box.
- "Binary search on the answer" applies the same halving to any monotonic predicate.

# Flash Cards

Q: What precondition must hold for binary search to be correct?
A: The input sequence must be sorted.

Q: Why is binary search O(log n)?
A: Each comparison discards half the remaining elements, so the window empties after about log₂ n steps.

Q: What is the classic bug that makes binary search loop forever?
A: Updating the window with lo = mid or hi = mid instead of mid + 1 / mid - 1, so the window stops shrinking.

Q: What does bisect_left(a, x) return?
A: The leftmost index at which x could be inserted to keep a sorted — before any elements equal to x.

Q: Can binary search be applied when there is no array?
A: Yes — "binary search on the answer" halves a range of candidate answers using a monotonic true/false predicate.

Q: Why isn't building a sorted list with repeated bisect.insort O(n log n)?
A: Each insertion shifts elements in the list (O(n)), so n insertions cost O(n²) despite the O(log n) search.

# Exercises

### Easy
Write a recursive binary search and give its time and space complexity (remember the
recursion stack).

### Medium
Using `bisect`, count how many values in a sorted list fall in the inclusive range
`[low, high]` in `O(log n)`. (Hint: `bisect_right(high) - bisect_left(low)`.)

### Challenging
Given a sorted list that may contain duplicates, return the index of the **first**
occurrence of a target in `O(log n)` by modifying binary search to keep searching left
after a match. Prove your loop still halves the window each step.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 2
  (Exercise on binary search) and the searching discussion.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 1.4 / 3.1 (binary search).
- Python — [`bisect`](https://docs.python.org/3/library/bisect.html) module documentation.
