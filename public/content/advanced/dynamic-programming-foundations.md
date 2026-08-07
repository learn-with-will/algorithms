---
id: lesson-17
slug: dynamic-programming-foundations
title: "Dynamic Programming I: Foundations"
level: advanced
order: 17
duration: 32
tags:
  - dynamic-programming
  - memoization
  - tabulation
  - knapsack
  - optimal-substructure
---

# Learning Objectives

By the end of this lesson you will be able to:

- Identify the two properties a problem needs for **dynamic programming**.
- Apply **memoization** (top-down) and **tabulation** (bottom-up), and convert between them.
- Analyze a DP's cost as *number of subproblems × work per subproblem*.
- Solve Fibonacci, coin change, and the 0/1 knapsack with DP.
- Distinguish DP from divide-and-conquer and greedy.

# Why This Concept Exists

We saw that naive recursive Fibonacci is exponential because it re-solves the same
subproblems again and again. **Dynamic programming** is the systematic cure: solve each
subproblem **once**, store the answer, and reuse it. That single idea turns many exponential
brute-force recursions into polynomial-time algorithms. DP is the technique behind optimal
solutions to a huge class of optimization and counting problems — shortest edits, resource
allocation, sequence alignment — wherever a problem breaks into overlapping, optimally-
composable subproblems.

# Concept Explanation

### When DP applies: two properties

Dynamic programming works when a problem has both:

1. **Optimal substructure** — an optimal solution is built from optimal solutions to its
   subproblems. (Shortest paths have it; longest *simple* paths do not.)
2. **Overlapping subproblems** — the recursion revisits the same subproblems many times, so
   caching pays off. (This is what separates DP from divide-and-conquer, whose subproblems
   are distinct.)

### Two ways to implement DP

- **Memoization (top-down).** Write the natural recursion, but cache each result the first
  time you compute it and return the cached value on repeats. Easy to derive from the
  recurrence; only the reachable subproblems are computed.
- **Tabulation (bottom-up).** Identify the subproblem dependency order and fill a table from
  the smallest subproblems up to the answer, with iteration instead of recursion. No
  recursion-depth limit, and often lower constant-factor overhead.

Both compute the same subproblems; they differ in direction and mechanics.

### Analyzing a DP

The running time of a DP is roughly:

```text
(number of distinct subproblems) × (work to combine each from smaller ones)
```

For Fibonacci that is `n` subproblems × `O(1)` = `O(n)`. For 0/1 knapsack it is
`n·W` subproblems × `O(1)` = `O(n·W)`.

### DP vs. divide-and-conquer vs. greedy

- **Divide-and-conquer** splits into *independent* subproblems (no overlap) — merge sort.
- **Dynamic programming** reuses *overlapping* subproblems and considers all choices.
- **Greedy** (next lesson) makes one locally-best choice and never reconsiders — faster, but
  only correct for problems with the greedy-choice property.

# Key Terminology

- **Optimal substructure** — optimal solution composed of optimal subsolutions.
- **Overlapping subproblems** — the same subproblems recur, so caching helps.
- **Memoization** — top-down recursion with a cache.
- **Tabulation** — bottom-up table filling.
- **State** — the parameters that identify a subproblem (the table's indices).

# Complexity

| Problem | Subproblems | Work each | Time | Space |
| ------- | ----------- | --------- | ---- | ----- |
| Fibonacci | n | O(1) | O(n) | O(1)–O(n) |
| Coin change (min coins) | amount | O(#coins) | O(amount · #coins) | O(amount) |
| 0/1 knapsack | n · W | O(1) | O(n · W) | O(n · W) → O(W) |

(0/1 knapsack's `O(nW)` is *pseudo-polynomial*: `W` is a numeric value, not the input's size.)

# Implementation in Python

```python
from functools import lru_cache

# --- Fibonacci: memoization (top-down) ---
@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)     # each n computed once -> O(n)

# --- Fibonacci: tabulation (bottom-up), O(1) space ---
def fib_tab(n: int) -> int:
    if n < 2:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr

# --- Coin change: fewest coins to make `amount` ---
def coin_change(coins: list[int], amount: int) -> int:
    INF = amount + 1
    dp = [0] + [INF] * amount          # dp[a] = fewest coins to make a
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1
```

# Real World Analogy

Dynamic programming is filling in a **spreadsheet**. Each cell's value is defined by a
formula referring to earlier cells. You do not recompute a cell every time it is referenced —
you compute it once and every later formula just reads it. Tabulation is filling the sheet
top-to-bottom so every cell's inputs are ready; memoization is a lazy sheet that computes a
cell the first time you look at it and caches the result.

# Examples

## Example 1 — Basic: memoization vs. tabulation

```python
fib(50)       # 12586269025 — instant, because each fib(k) is computed once
fib_tab(50)   # same result, O(1) space, no recursion
```

**Why this is good:** the two implementations show DP's two faces — a cached recursion and an
iterative table — computing the identical subproblems. Tabulation additionally lets us drop
to `O(1)` space by keeping only the last two values.

## Example 2 — Real-world: making change with fewest coins

```python
coin_change([1, 5, 6, 9], 11)   # 2  (5 + 6)
```

```text
dp[0]=0
dp[1]=1 (1)     dp[5]=1 (5)      dp[6]=1 (6)
dp[10]=2 (5+5)  dp[11]=2 (5+6)   <- optimal substructure: best(11)=best(11-6)+1
```

**Why this is good:** a greedy "take the biggest coin" gives 9+1+1 = 3 coins, which is *wrong*
here — DP considers every coin at every amount and finds the true optimum (2). It is the
classic case where greedy fails and DP is required.

## Example 3 — Best practice / edge case: 0/1 knapsack with space reduction

```python
def knapsack(weights, values, W):
    dp = [0] * (W + 1)                 # 1-D rolling table
    for i in range(len(weights)):
        # iterate capacities DOWNWARD so each item is used at most once (0/1)
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[W]
```

**Why this is good:** the 2-D `O(nW)` table collapses to a 1-D `O(W)` one by reusing the row.
The subtle part — iterating capacity **downward** — is what keeps it a *0/1* knapsack (each
item once) rather than unbounded. Recognizing when a DP's space can be reduced is a core skill.

# Common Mistakes

- **Applying DP without optimal substructure.** Not every problem decomposes optimally;
  longest *simple* path in a graph, for instance, does not.
- **A wrong or too-large state.** The state must capture exactly what the recurrence needs —
  too little is incorrect, too much wastes time and memory.
- **Forgetting to memoize.** Without caching, the recursion stays exponential.
- **Mixing up 0/1 and unbounded knapsack.** Iteration direction (down vs. up) decides whether
  each item can be reused.

# Best Practices

- Nail the **state** and **recurrence** first; the code follows directly.
- Start with **memoization** (easy from the recurrence); switch to **tabulation** for speed or
  to avoid recursion limits.
- Estimate cost as *subproblems × work each* before coding — it tells you if the DP is feasible.
- Reduce dimensions when a row only depends on the previous one (rolling array).

# Summary

- DP applies when a problem has **optimal substructure** and **overlapping subproblems**.
- **Memoization** is top-down caching; **tabulation** is bottom-up table filling.
- Cost ≈ number of subproblems × work per subproblem.
- Fibonacci `O(n)`, coin change `O(amount · #coins)`, 0/1 knapsack `O(n·W)`.
- DP differs from divide-and-conquer (overlap) and greedy (considers all choices).

# Flash Cards

Q: What two properties must a problem have for dynamic programming to apply?
A: Optimal substructure (optimal solutions built from optimal subsolutions) and overlapping subproblems (the same subproblems recur).

Q: What is the difference between memoization and tabulation?
A: Memoization is top-down recursion with a cache; tabulation is bottom-up iterative table filling. Both solve each subproblem once.

Q: How do you estimate a DP algorithm's running time?
A: Multiply the number of distinct subproblems by the work needed to combine each from smaller ones.

Q: Why does greedy fail on coin change with coins like {1, 5, 6, 9} for amount 11?
A: Taking the largest coin first (9+1+1 = 3) misses the optimum (5+6 = 2); DP considers all choices and finds the true minimum.

Q: What makes the 0/1 knapsack O(nW) only "pseudo-polynomial"?
A: W is a numeric value, not the size of the input; the running time depends on the magnitude of W, not just the number of items.

Q: How does DP differ from divide-and-conquer?
A: Divide-and-conquer's subproblems are independent (no overlap); DP's overlap, so caching their solutions is what pays off.

# Exercises

### Easy
Write a memoized function for the number of distinct ways to climb `n` stairs taking 1 or 2
steps at a time. What familiar sequence do the answers form?

### Medium
Solve **unbounded** coin change (each coin usable unlimited times) counting the *number of
ways* to make an amount. How does the loop structure differ from the 0/1 case?

### Challenging
Reconstruct the actual chosen items for the 0/1 knapsack (not just the max value). Explain
what extra information you must store or how you back-track through the table to recover them.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 14
  ("Dynamic Programming"): optimal substructure, overlapping subproblems, memo vs. tabulation.
- Sedgewick & Wayne / Skiena — Skiena's *Algorithm Design Manual*, 3rd ed., Chapter 10
  ("Dynamic Programming"), has an especially practical treatment.
- Python — [`functools.lru_cache`](https://docs.python.org/3/library/functools.html#functools.lru_cache).
