---
slug: tabulation-bottom-up-dp
title: "Tabulation: Bottom-Up Dynamic Programming"
topic: dynamic-programming
kind: technique
summary: "Tabulation iteratively fills a state table from trivial base cases to final targets, eliminating call stack overhead."
tags: ["tabulation", "bottom-up", "iterative", "optimization"]
related: ["memoization-top-down-dp", "optimal-substructure-explained", "knapsack-0-1-state-and-space-optimization"]
---
> **In one line:** Tabulation iteratively fills a DP state table from trivial base cases up to the desired target.

## The idea

**Tabulation (Bottom-Up DP)** eliminates recursion entirely. Instead of starting at the target and recursing down, it starts at the trivial **base cases** and iteratively populates a state table in topological order of subproblem dependency.

Steps for tabulation:
1. Define the state array (e.g. `dp = [0] * (n + 1)`).
2. Initialize base cases (e.g. `dp[0] = 0, dp[1] = 1`).
3. Iterate in order, using the transition formula to compute each state from previously computed states:
   $$dp[i] = dp[i-1] + dp[i-2]$$
4. Return `dp[n]`.

Tabulation eliminates function call stack frames and provides superior CPU cache locality.

## See it

Bottom-up tabulation and constant-space rolling optimization:

```python
# Standard tabulation: O(n) time and O(n) space
def fib_tabulation(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# Space-optimized rolling variables: O(n) time and O(1) space!
def fib_rolling(n: int) -> int:
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1

print("fib(100) via tabulation:", fib_rolling(100))
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

Because $dp[i]$ depends only on the immediately preceding two values ($dp[i-1]$ and $dp[i-2]$), we do not need to keep all $n$ historical entries in memory!

By maintaining just two rolling scalar variables (`prev1`, `prev2`), we reduce auxiliary space complexity from **$O(n)$ to $O(1)$ constant space**. This rolling buffer optimization is a staple of production DP systems.

From an algorithmic engineering perspective, understanding the precise operational characteristics of tabulation: bottom-up dynamic programming allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Tabulation requires knowing the correct topological evaluation order so dependencies are computed before they are consumed.
- Off-by-one errors in table sizing (n vs n + 1) are the most common bug in tabulation.

## Remember

- Tabulation solves subproblems iteratively starting from base cases.
- Eliminates call stack recursion limits and enhances CPU cache performance.
- State reduction often enables compressing O(n) tables down to O(1) space.
