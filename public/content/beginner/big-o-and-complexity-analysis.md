---
id: lesson-02
slug: big-o-and-complexity-analysis
title: "Big-O and Complexity Analysis"
level: beginner
order: 2
duration: 28
tags:
  - complexity
  - big-o
  - asymptotic-analysis
  - time
  - space
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain why we measure an algorithm's cost by how it **grows**, not in seconds.
- Define big-O, big-Omega, and big-Theta and say which bound each one gives.
- Simplify a running-time expression by dropping constants and lower-order terms.
- Distinguish **best**, **average**, and **worst** case, and know which we usually quote.
- Recognize the common growth classes and order them, and reason about **space** too.

# Why This Concept Exists

Suppose one algorithm takes `3n + 100` steps and another takes `n²/2`. Which is
better? On a small input the second might win; on a large one the first crushes it.
Timing them in seconds does not settle it either — the numbers depend on your CPU,
language, and mood of the operating system.

We need a machine-independent way to talk about how an algorithm's cost **scales with
input size**. Asymptotic analysis does exactly that: it describes the *shape* of the
growth as the input `n` gets large, throwing away the details that do not affect that
shape. That lets us compare algorithms honestly and predict which will still be usable
when `n` is a million.

# Concept Explanation

### Counting operations

We estimate running time by counting **basic operations** (comparisons, additions,
assignments, array accesses) as a function of the input size `n`, assuming each basic
operation takes constant time. We do not care about the exact constant — we care how
the count grows.

### Big-O, big-Omega, big-Theta

These three notations bound a function `f(n)` (the operation count) by a simpler
function `g(n)`:

- **Big-O — asymptotic upper bound.** `f(n) = O(g(n))` if there are positive constants
  `c` and `n₀` such that `0 ≤ f(n) ≤ c·g(n)` for all `n ≥ n₀`. "`f` grows *no faster
  than* `g`."
- **Big-Omega — asymptotic lower bound.** `f(n) = Ω(g(n))` if `0 ≤ c·g(n) ≤ f(n)` for
  all `n ≥ n₀`. "`f` grows *at least as fast as* `g`."
- **Big-Theta — tight bound.** `f(n) = Θ(g(n))` if it is **both** `O(g(n))` and
  `Ω(g(n))`. "`f` grows *exactly like* `g`."

In everyday use people say "O" even when they mean a tight bound, but the distinction
matters: `O` alone is only a ceiling. Saying insertion sort is `O(n²)` is true but so
is `O(n³)`; the *tight* statement is `Θ(n²)` in the worst case.

### Drop constants and lower-order terms

Because the constants `c` and `n₀` are free, asymptotic notation ignores constant
factors and anything but the fastest-growing term:

```text
3n² + 100n + 7   =  Θ(n²)
2ⁿ + n¹⁰⁰        =  Θ(2ⁿ)      (exponential eventually dominates any polynomial)
5                =  Θ(1)       (a constant number of steps)
```

### Best, average, and worst case

The same algorithm can cost different amounts on different inputs of the same size.
Linear search for a target in `n` elements:

- **Best case** — the target is first: `Θ(1)`.
- **Worst case** — absent or last: `Θ(n)`.
- **Average case** — over random positions, about `n/2` comparisons: `Θ(n)`.

Unless we say otherwise, we quote the **worst case**, because it is a *guarantee*: the
algorithm will never be slower than that.

### Amortized cost

Sometimes a single operation is occasionally expensive but cheap on average across a
sequence of operations. Appending to Python's `list` is the classic case: almost every
append is `O(1)`, but once in a while the list must grow and copy everything, costing
`O(n)`. Averaged over many appends the cost is `O(1)` **amortized** (next lesson proves
this). Amortized is not the same as average-case: it is a worst-case guarantee over a
*sequence* of operations, with no probability involved.

### Space complexity

The same notation describes **extra memory** an algorithm needs beyond its input,
including the space taken by the recursion call stack. An in-place sort uses `O(1)`
extra space; merge sort uses `O(n)`; a recursion `n` levels deep uses `O(n)` stack.

# Key Terminology

- **Asymptotic** — behaviour as `n → ∞`; the large-input trend.
- **O(g)** — upper bound; **Ω(g)** — lower bound; **Θ(g)** — tight (both).
- **Worst / best / average case** — cost on the hardest / easiest / typical input of size `n`.
- **Amortized cost** — average cost per operation across a worst-case sequence.
- **Space complexity** — extra memory used as a function of `n`.

# Complexity

The growth classes you will meet, slowest-growing first, with a feel for `n = 1,000,000`:

| Class | Name | Example | Steps at n = 10⁶ |
| ----- | ---- | ------- | ---------------- |
| O(1) | constant | index a list, hash lookup | 1 |
| O(log n) | logarithmic | binary search | ~20 |
| O(n) | linear | scan a list | 1,000,000 |
| O(n log n) | linearithmic | merge sort, heapsort | ~20,000,000 |
| O(n²) | quadratic | nested loop, insertion sort worst case | 10¹² |
| O(2ⁿ) | exponential | brute-force subsets | astronomically large |
| O(n!) | factorial | brute-force permutations | astronomically large |

The gap between `O(n log n)` and `O(n²)` is the difference between "instant" and
"hours" at a million elements — which is why so much of this course is about turning
quadratic algorithms into linearithmic ones.

# Implementation in Python

```python
# O(1) — a fixed number of operations, independent of n
def first(a: list[int]) -> int:
    return a[0]

# O(n) — one pass over n elements
def contains(a: list[int], x: int) -> bool:
    for value in a:
        if value == x:
            return True
    return False

# O(n^2) — for each element, a full inner pass
def has_duplicate_pair(a: list[int]) -> bool:
    n = len(a)
    for i in range(n):
        for j in range(i + 1, n):
            if a[i] == a[j]:
                return True
    return False

# O(log n) — the search space halves every step
def count_halvings(n: int) -> int:
    steps = 0
    while n > 1:
        n //= 2
        steps += 1
    return steps
```

# Real World Analogy

Finding a name in a phone book. Reading every entry from the front is **linear** —
twice the book, twice the work. Opening to the middle, deciding which half the name is
in, and repeating is **logarithmic** — doubling the book adds just *one* extra step.
That is why `O(log n)` feels almost free: it barely notices how big the input got.

# Examples

## Example 1 — Basic: analyzing nested loops

```python
def count_pairs(a: list[int]) -> int:
    count = 0
    for i in range(len(a)):          # runs n times
        for j in range(i + 1, len(a)):  # runs n-1, n-2, ... times
            count += 1
    return count
```

```text
total iterations = (n-1) + (n-2) + ... + 1 = n(n-1)/2 = Θ(n²)
```

**Why this is good:** the inner loop's length depends on `i`, but the sum of a
triangle of iterations is still `n(n-1)/2`, which is `Θ(n²)`. Recognizing this
triangular sum is one of the most common analyses you will do.

## Example 2 — Real-world: the right container changes the class

```python
def count_common_slow(a: list[int], b: list[int]) -> int:
    # `x in b` scans b: O(len(b)) each time -> overall O(len(a) * len(b))
    return sum(1 for x in a if x in b)

def count_common_fast(a: list[int], b: list[int]) -> int:
    seen = set(b)               # build once: O(len(b))
    # `x in seen` is O(1) average -> overall O(len(a) + len(b))
    return sum(1 for x in a if x in seen)
```

**Why this is good:** the algorithms are "the same", but membership testing against a
`list` is `O(n)` while against a `set` is `O(1)` average. Choosing the container drops
the whole routine from quadratic to linear — the single most common real-world speedup.

## Example 3 — Best practice / edge case: constants and small n

```text
Algorithm A: 1000 · n         (linear, big constant)
Algorithm B: n²               (quadratic, small constant)

n = 10    ->  A = 10,000   B = 100      B wins
n = 10000 ->  A = 10⁷      B = 10⁸      A wins
```

**Why this is good:** asymptotics describe *large* `n`. For small inputs the constant
factors that big-O hides can dominate, which is exactly why real sort routines switch
to insertion sort on tiny subarrays. Use asymptotics to choose, but remember they are
a statement about scale, not about every input.

# Common Mistakes

- **Writing `O` when you mean `Θ`.** `O` is only an upper bound; `n = O(n²)` is true but
  useless. Quote the tight bound when you know it.
- **Keeping constants or lower-order terms.** `Θ(2n + 5)` should be written `Θ(n)`.
- **Assuming a bigger class is always slower.** For small `n`, constants can make an
  `O(n²)` routine beat an `O(n log n)` one.
- **Forgetting hidden costs.** `x in a_list`, `a_list.insert(0, x)`, and slicing all
  cost `O(n)`; string concatenation in a loop can be `O(n²)`.
- **Ignoring space.** A recursive routine `n` frames deep uses `O(n)` stack even if it
  does little work per call.

# Best Practices

- Identify `n`, count the dominant operation, then **simplify** to a single Θ class.
- Quote the **worst case** unless you deliberately mean best, average, or amortized.
- Watch the **container**: `set`/`dict` membership is `O(1)` average; `list` is `O(n)`.
- Analyze **space** alongside time — including recursion depth.

# Summary

- Asymptotic notation describes how cost grows with `n`, ignoring machine details.
- `O` is an upper bound, `Ω` a lower bound, `Θ` a tight bound (both).
- Drop constant factors and lower-order terms; keep the fastest-growing term.
- Quote the worst case by default; amortized cost averages a worst-case *sequence*.
- Know the ladder: `1 < log n < n < n log n < n² < 2ⁿ < n!`.

# Flash Cards

Q: What does f(n) = O(g(n)) mean formally?
A: There are positive constants c and n₀ such that 0 ≤ f(n) ≤ c·g(n) for all n ≥ n₀ — g is an upper bound on f's growth.

Q: What is the difference between O and Θ?
A: O is only an upper bound; Θ is a tight bound, meaning the function is both O(g) and Ω(g).

Q: Simplify Θ(3n² + 100n + 7).
A: Θ(n²) — drop constant factors and lower-order terms, keep the fastest-growing term.

Q: Which case do we quote by default, and why?
A: The worst case, because it is a guarantee the algorithm will never exceed.

Q: How does amortized cost differ from average case?
A: Amortized is a worst-case average over a sequence of operations (no probability); average case averages over a distribution of inputs.

Q: Order these from slowest- to fastest-growing: n², log n, n, 2ⁿ, n log n.
A: log n < n < n log n < n² < 2ⁿ.

# Exercises

### Easy
Give the tight Θ bound for each: (a) a single loop over `n` items; (b) two separate
(not nested) loops over `n`; (c) three nested loops over `n`.

### Medium
Explain why `count_common_slow` above is `O(len(a) · len(b))` while `count_common_fast`
is `O(len(a) + len(b))`. What property of `set` membership makes the difference?

### Challenging
A function does `O(n)` work, then calls itself twice on inputs of size `n/2`. Write the
recurrence for its running time and state its Θ class. (Hint: it is the same recurrence
as merge sort — you will prove it in Lesson 10.)

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 3
  ("Characterizing Running Times"), the formal definitions of O, Ω, and Θ.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 1.4 ("Analysis of Algorithms").
- Python — [TimeComplexity wiki](https://wiki.python.org/moin/TimeComplexity) for the
  cost of `list`, `dict`, `set`, and `deque` operations.
