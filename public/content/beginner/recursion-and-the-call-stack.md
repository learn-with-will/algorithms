---
id: lesson-07
slug: recursion-and-the-call-stack
title: "Recursion and the Call Stack"
level: beginner
order: 7
duration: 26
tags:
  - recursion
  - call-stack
  - base-case
  - recurrence
  - fundamentals
---

# Learning Objectives

By the end of this lesson you will be able to:

- Write a recursive function with a correct **base case** and **recursive case**.
- Explain how the **call stack** stores each pending call and bounds recursion depth.
- Write a **recurrence** for a recursive algorithm's running time.
- Recognize when naive recursion is exponentially wasteful (and needs memoization).
- Respect Python's recursion limit and know it has no tail-call optimization.

# Why This Concept Exists

Many problems are naturally **self-similar**: a problem's answer is defined in terms of
the same problem on smaller inputs. A factorial is `n` times the factorial of `n-1`; a
tree's size is the size of its subtrees plus one; a sorted merge is a merge of two
already-sorted halves. **Recursion** lets you write these solutions the way they are
defined — solve the small case directly, and reduce every larger case toward it. It is
the backbone of divide-and-conquer, tree and graph traversal, and backtracking. But
recursion is not free: every call consumes stack space, so you must understand the call
stack to use it safely.

# Concept Explanation

### Base case and recursive case

Every correct recursive function has two parts:

- A **base case** that returns an answer directly, with no further recursion. It is what
  stops the process.
- A **recursive case** that reduces the problem toward the base case and calls the
  function on the smaller input.

If the base case is missing or never reached, the recursion never stops.

```python
def factorial(n: int) -> int:
    if n <= 1:              # base case
        return 1
    return n * factorial(n - 1)   # recursive case: smaller input
```

### The call stack

When a function calls another (or itself), the runtime pushes a **stack frame** holding
that call's local variables and where to resume. When the call returns, its frame is
popped. Recursive calls stack up until the base case is hit, then unwind:

```text
call:   factorial(3) -> factorial(2) -> factorial(1)   [base returns 1]
stack depth grows ->                                    then unwinds <-
return: 1 -> 1*1=1 -> 2*1=2 -> 3*2=6
```

The maximum depth of this stack is the recursion's **space cost**. A recursion `n` levels
deep uses `O(n)` stack space even if each call does `O(1)` work.

### Recurrences

The running time of a recursive function is described by a **recurrence** — an equation
that expresses `T(n)` in terms of smaller inputs:

- `factorial`: `T(n) = T(n-1) + O(1)` → `T(n) = O(n)`.
- naive `fibonacci`: `T(n) = T(n-1) + T(n-2) + O(1)` → **exponential**, `Θ(φⁿ)` with
  `φ ≈ 1.618`. Each call spawns two more, so the work explodes.

We will solve recurrences like merge sort's `T(n) = 2T(n/2) + O(n)` in Lesson 10.

### Recursion vs. iteration, and Python's limits

Any recursion can be rewritten as a loop with an explicit stack, and vice versa. Recursion
is often clearer (especially for trees), but in **CPython** it comes with two caveats:

- The default recursion limit is **1000** (`sys.getrecursionlimit()`), so deep *linear*
  recursion raises `RecursionError`. Raise it with `sys.setrecursionlimit`, or convert to
  iteration.
- CPython does **not** perform tail-call optimization, so a tail-recursive call still
  grows the stack. Deep recursion is not "free" the way it is in some functional languages.

# Key Terminology

- **Base case** — the non-recursive case that stops the recursion.
- **Recursive case** — reduces the problem and recurses on a smaller input.
- **Call stack / stack frame** — where pending calls and their locals live.
- **Recursion depth** — the maximum number of stacked frames = stack space used.
- **Recurrence** — an equation for `T(n)` in terms of smaller `n`.

# Complexity

| Function | Time | Stack space |
| -------- | ---- | ----------- |
| `factorial(n)` | O(n) | O(n) |
| `sum_list(n items)` | O(n) | O(n) |
| naive `fibonacci(n)` | Θ(φⁿ) ≈ exponential | O(n) |
| memoized `fibonacci(n)` | O(n) | O(n) |

Note the two Fibonaccis: same problem, but memoizing collapses exponential time to linear
(the heart of dynamic programming, Lesson 17).

# Implementation in Python

```python
def sum_list(a: list[int], i: int = 0) -> int:
    """Sum a[i:] recursively."""
    if i == len(a):        # base case: empty suffix sums to 0
        return 0
    return a[i] + sum_list(a, i + 1)   # recursive case

# Iterative equivalent — no stack-depth limit
def sum_list_iter(a: list[int]) -> int:
    total = 0
    for x in a:
        total += x
    return total
```

# Real World Analogy

Recursion is a set of **Russian nesting dolls**. To count them, you open the outer doll,
find another inside, open that, and keep going until you reach the tiny solid doll that
does not open — the **base case**. Then you close them back up one by one, each step
building on the result from inside. The stack of opened dolls on your table is the **call
stack**: the deeper the nesting, the more space they take up.

# Examples

## Example 1 — Basic: factorial, traced

```python
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

```text
factorial(4)
= 4 * factorial(3)
= 4 * (3 * factorial(2))
= 4 * (3 * (2 * factorial(1)))   <- base case returns 1
= 4 * 3 * 2 * 1 = 24
```

**Why this is good:** the base case (`n <= 1`) is reached because each call decreases `n`,
guaranteeing termination. The recurrence `T(n) = T(n-1) + O(1)` gives `O(n)` time and
`O(n)` stack depth.

## Example 2 — Real-world: recursion fits trees naturally

```python
def tree_sum(node) -> int:
    if node is None:            # base case: empty subtree
        return 0
    return node.value + tree_sum(node.left) + tree_sum(node.right)
```

**Why this is good:** a tree *is* recursive — each subtree is a smaller tree — so the code
mirrors the structure exactly. The stack depth equals the tree's height, which is why
balanced trees (Lesson 14) keep recursive traversals shallow.

## Example 3 — Best practice / edge case: exponential recursion, and the fix

```python
def fib_naive(n: int) -> int:
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)   # recomputes the same calls!

from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n: int) -> int:
    if n < 2:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)      # each n computed once
```

```text
fib_naive(5) call tree (note the repeats):
                fib(5)
             /         \
         fib(4)        fib(3)
        /     \        /    \
    fib(3)  fib(2)  fib(2) fib(1)   ...  <- fib(3), fib(2) computed many times
```

**Why this is good:** it shows the trap and the cure. `fib_naive` re-solves the same
subproblems, giving exponential time; `@lru_cache` remembers each result so every `n` is
computed once, collapsing it to `O(n)`. That single idea is dynamic programming.

# Common Mistakes

- **No base case, or one that is never reached.** The recursion runs until Python raises
  `RecursionError`. Ensure each call moves strictly toward the base case.
- **Exponential recomputation.** Naive recursion that re-solves overlapping subproblems
  (like Fibonacci) is exponential — memoize it.
- **Blowing the stack on deep linear recursion.** With depth near/over 1000, convert to
  iteration or raise the limit deliberately.
- **Assuming tail-call optimization.** CPython does not have it; a tail call still adds a frame.

# Best Practices

- Write the **base case first**, then the recursive case that shrinks the input.
- For self-similar structures (trees, divide-and-conquer), prefer recursion for clarity.
- For deep *linear* processes (walking a long list), prefer iteration to avoid stack limits.
- If subproblems overlap, add **memoization** (`functools.lru_cache`) to avoid recomputation.

# Summary

- A recursive function has a base case (stops) and a recursive case (shrinks the input).
- Each call adds a stack frame; recursion depth is the stack-space cost, `O(depth)`.
- A recurrence expresses `T(n)` from smaller inputs; naive Fibonacci is exponential.
- Memoization turns overlapping-subproblem recursion from exponential to polynomial.
- In CPython, mind the ~1000 recursion limit and the absence of tail-call optimization.

# Flash Cards

Q: What are the two required parts of a recursive function?
A: A base case that returns directly and stops the recursion, and a recursive case that reduces the input and recurses.

Q: What does the call stack store, and what does its depth cost?
A: A stack frame per pending call (locals + return point); the maximum depth is the recursion's O(depth) space cost.

Q: Why is naive recursive Fibonacci exponential?
A: Each call spawns two more and recomputes the same subproblems, giving Θ(φⁿ) work; memoization collapses it to O(n).

Q: What is a recurrence?
A: An equation expressing an algorithm's running time T(n) in terms of its cost on smaller inputs, e.g. T(n) = T(n-1) + O(1).

Q: What is CPython's default recursion limit, and does it optimize tail calls?
A: 1000, and no — CPython does not do tail-call optimization, so even tail-recursive calls grow the stack.

Q: When should you convert recursion to iteration?
A: For deep linear recursion that could exceed the stack limit; iteration with an explicit loop/stack avoids RecursionError.

# Exercises

### Easy
Write a recursive `power(base, exp)` for non-negative `exp`. State the base case and the
recurrence for its running time.

### Medium
Write a recursive function to reverse a string, then rewrite it iteratively. For what
input length would the recursive version risk a `RecursionError` in CPython?

### Challenging
Implement `power(base, exp)` using **fast exponentiation** (exponentiation by squaring) so
it runs in `O(log exp)` time. Write its recurrence and explain why halving the exponent
each step yields the logarithmic bound.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 2
  (divide-and-conquer, recurrences) and Chapter 4 (solving recurrences).
- Python — [`sys.setrecursionlimit`](https://docs.python.org/3/library/sys.html#sys.setrecursionlimit)
  and [`functools.lru_cache`](https://docs.python.org/3/library/functools.html#functools.lru_cache).
