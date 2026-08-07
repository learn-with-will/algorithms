---
id: lesson-16
slug: non-comparison-sorting
title: "Non-Comparison Sorting: Counting, Radix, Bucket"
level: intermediate
order: 16
duration: 28
tags:
  - sorting
  - counting-sort
  - radix-sort
  - bucket-sort
  - lower-bound
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the `Ω(n log n)` lower bound for **comparison** sorts and why it holds.
- Implement **counting sort** and give its `O(n + k)` cost and stability.
- Explain how **radix sort** sorts multi-digit keys in `O(d·(n + k))`.
- Describe **bucket sort** and its `O(n)`-average assumption.
- Recognize when non-comparison sorts apply — and when they do not.

# Why This Concept Exists

Every sort we have seen — insertion, merge, quick, heap — orders elements by **comparing**
them. There is a hard limit on that approach: no comparison sort can beat `Ω(n log n)` in the
worst case. So how do some sorts run in *linear* time? They stop comparing. If the keys have
exploitable structure — small integers, fixed-width digits, a known distribution — you can
place each element using its key **directly as an index**, sidestepping comparisons
entirely. That is how counting, radix, and bucket sort break the `n log n` barrier, for the
special inputs they require.

# Concept Explanation

### The comparison-sort lower bound

Model any comparison sort as a **decision tree**: each internal node is a comparison, each
leaf a possible ordering. Sorting `n` distinct elements has `n!` possible orderings, so the
tree needs at least `n!` leaves. A binary tree with `n!` leaves has height at least
`log₂(n!)`, and by Stirling's approximation `log₂(n!) = Θ(n log n)`. The height is the
worst-case number of comparisons, so **any comparison sort is `Ω(n log n)`**. To go faster,
you must not sort by comparisons.

### Counting sort

For integer keys in a small range `[0, k]`, **counting sort** counts how many times each key
appears, turns those counts into starting positions (prefix sums), and places each element
directly. It runs in `O(n + k)` time and space, and it is **stable** (equal keys keep order).
It shines when `k = O(n)`; if `k` is huge, the `O(k)` space and time make it worse than a
comparison sort.

### Radix sort

**Radix sort** sorts numbers (or fixed-length strings) one **digit** at a time, from least
significant to most significant, using a **stable** sort — usually counting sort — for each
digit. With `d` digits in base `k`, it is `O(d·(n + k))`. For fixed-width integers `d` and
`k` are constants, so radix sort is effectively `O(n)`. Stability per digit is essential:
it is what lets earlier (less significant) digit orderings survive later passes.

### Bucket sort

**Bucket sort** assumes keys are drawn roughly **uniformly** from a range. It scatters them
into `n` buckets by value, sorts each bucket (e.g. with insertion sort), and concatenates.
When the distribution is uniform each bucket holds `O(1)` elements, giving `O(n)` **average**
time; a skewed distribution can pile everything into one bucket and degrade to `O(n²)` (or
`O(n log n)` if buckets are sorted with a comparison sort).

### They don't beat comparison sorts in general

These are not free lunches. They need keys with the right structure — small/bounded integers,
fixed-width digits, or a known uniform distribution. On arbitrary comparable keys (floats
across a huge range, custom objects), you are back to `O(n log n)` comparison sorts.

# Key Terminology

- **Comparison sort** — orders elements only by comparing pairs; `Ω(n log n)` lower bound.
- **Counting sort** — index-by-key sort for small integer ranges, `O(n + k)`, stable.
- **Prefix sum** — cumulative counts giving each key's output position.
- **Radix sort** — digit-by-digit stable sort, `O(d·(n + k))`.
- **Bucket sort** — distribute-by-value then sort buckets; `O(n)` average for uniform keys.

# Complexity

| Sort | Time | Space | Stable? | Requires |
| ---- | ---- | ----- | ------- | -------- |
| Counting | O(n + k) | O(n + k) | Yes | integer keys in [0, k] |
| Radix (LSD) | O(d·(n + k)) | O(n + k) | Yes | fixed-width integer/string keys |
| Bucket | O(n) average, O(n²) worst | O(n) | depends | ~uniformly distributed keys |
| Any comparison sort | Ω(n log n) worst | — | — | only comparable keys |

# Implementation in Python

```python
def counting_sort(a: list[int], k: int) -> list[int]:
    """Stable sort of a where every value is an integer in [0, k]."""
    count = [0] * (k + 1)
    for x in a:                       # 1. tally each key
        count[x] += 1
    for i in range(1, k + 1):         # 2. prefix sums -> end positions
        count[i] += count[i - 1]
    output = [0] * len(a)
    for x in reversed(a):             # 3. place from the right to stay STABLE
        count[x] -= 1
        output[count[x]] = x
    return output


def radix_sort(a: list[int]) -> list[int]:
    """Sort non-negative ints by processing digits least-significant first."""
    if not a:
        return a
    max_val = max(a)
    exp = 1
    out = a[:]
    while max_val // exp > 0:          # one stable pass per digit
        out = _counting_by_digit(out, exp)
        exp *= 10
    return out


def _counting_by_digit(a: list[int], exp: int) -> list[int]:
    count = [0] * 10
    for x in a:
        count[(x // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    output = [0] * len(a)
    for x in reversed(a):              # stable placement per digit
        d = (x // exp) % 10
        count[d] -= 1
        output[count[d]] = x
    return output
```

# Real World Analogy

Counting and bucket sort are how a post office sorts mail: instead of comparing letters two
at a time, a clerk drops each letter straight into the **pigeonhole for its zip code**. The
zip code is used as an *address*, not compared to other letters. With enough pigeonholes, one
pass through the mail sorts it — the linear-time idea. Radix sort is sorting by zip code one
digit at a time, region then area then block.

# Examples

## Example 1 — Basic: counting sort

```python
counting_sort([2, 5, 3, 0, 2, 3, 0, 3], k=5)
# [0, 0, 2, 2, 3, 3, 3, 5]  in O(n + k), stable
```

**Why this is good:** no two input values are ever compared — the value *is* the index into
the count array. With `k` small relative to `n`, this is linear and stable.

## Example 2 — Real-world: radix sort fixed-width integers

```python
radix_sort([170, 45, 75, 90, 802, 24, 2, 66])
# [2, 24, 45, 66, 75, 90, 170, 802]
```

```text
by 1s digit -> 170 90 802 2 24 45 75 66
by 10s digit -> 802 2 24 45 66 170 75 90
by 100s digit -> 2 24 45 66 75 90 170 802   (sorted)
```

**Why this is good:** each pass is a stable counting sort on one digit. Because earlier
passes' order survives (stability), three linear passes sort the whole array — `O(d·n)`,
effectively `O(n)` for fixed-width numbers.

## Example 3 — Best practice / edge case: when k is too big

```text
counting_sort of 1,000 values with keys up to 1,000,000,000:
  count array of size k+1 ≈ 10^9  ->  O(k) time and space -> impractical.
  Here a comparison sort (Timsort, O(n log n)) is far better.
```

**Why this is good:** it marks the boundary. Counting sort is linear only when `k = O(n)`.
When the key range dwarfs `n`, its `O(k)` cost dominates and you should use a comparison
sort. Non-comparison sorts are specialists, not defaults.

# Common Mistakes

- **Using counting sort with a huge key range.** `O(k)` space/time explodes when `k ≫ n`.
- **Sorting non-integer / unbounded keys.** Counting and radix need integer (or integer-mapped),
  bounded keys; arbitrary floats or objects do not qualify.
- **Using a non-stable per-digit sort in radix sort.** Stability is required, or earlier
  digit orderings are lost and the result is wrong.
- **Assuming bucket sort is always `O(n)`.** That holds only for (roughly) uniform inputs; a
  skewed distribution can make it `O(n²)`.

# Best Practices

- Reach for counting/radix sort only when keys are **bounded integers** (or map to them) and
  `k = O(n)` — otherwise use a comparison sort.
- Keep the per-digit sort in radix sort **stable** (counting sort is).
- Use bucket sort when you genuinely know the input is **uniformly distributed**.
- In everyday Python, `sorted`/`list.sort` (Timsort) is the right default; use these
  specialists for specific, well-understood key structures.

# Summary

- Comparison sorts cannot beat `Ω(n log n)` — proven via the decision-tree argument.
- Non-comparison sorts avoid comparisons by using keys as indices, achieving linear time.
- **Counting sort**: `O(n + k)`, stable, for small integer ranges.
- **Radix sort**: `O(d·(n + k))` via stable per-digit passes; `O(n)` for fixed-width keys.
- **Bucket sort**: `O(n)` average for uniformly distributed keys, `O(n²)` worst case.

# Flash Cards

Q: What is the worst-case lower bound for any comparison-based sort, and why?
A: Ω(n log n) — a decision tree sorting n elements needs n! leaves, so its height is at least log₂(n!) = Θ(n log n).

Q: What is counting sort's time complexity and when is it a good choice?
A: O(n + k) for integer keys in [0, k]; a good choice when k = O(n), and it is stable.

Q: How does radix sort use counting sort?
A: It runs a stable counting sort on each digit from least to most significant; stability preserves earlier digit orderings.

Q: How do non-comparison sorts beat the Ω(n log n) bound?
A: They do not compare elements to each other — they use the key's value/digits as an index, so the comparison lower bound does not apply.

Q: When can bucket sort degrade from O(n) to O(n²)?
A: When the input is not uniformly distributed and many elements land in the same bucket.

Q: Why can't you counting-sort arbitrary floating-point numbers over a huge range?
A: Counting sort needs bounded integer keys; a huge range k makes its O(k) space and time impractical, and floats are not indices.

# Exercises

### Easy
Run `counting_sort([4, 1, 3, 1, 2], k=4)` by hand, showing the count array before and after
converting to prefix sums.

### Medium
Explain why the placement loop in `counting_sort` iterates over the input in **reverse** and
how that guarantees stability. What breaks if you iterate forward?

### Challenging
Radix sort can also process the **most significant digit first (MSD)**. Describe how MSD radix
sort works recursively, and explain one advantage (it can short-circuit) and one complication
(handling variable-length keys) compared with the LSD version.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 8
  ("Sorting in Linear Time"): the `Ω(n log n)` bound, counting sort, radix sort, bucket sort.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 5.1 (key-indexed counting and radix sorts).
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Section 4.11 (bucketing / distribution sorts).
