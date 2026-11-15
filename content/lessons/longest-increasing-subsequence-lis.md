---
slug: longest-increasing-subsequence-lis
title: "Longest Increasing Subsequence (LIS)"
topic: dynamic-programming
kind: technique
summary: "Solve LIS in O(n^2) with dynamic programming, or in O(n log n) by maintaining active tails with binary search."
tags: ["lis", "subsequence", "binary-search", "patience-sorting"]
related: ["longest-common-subsequence-lcs", "python-bisect-module", "binary-search-on-answer-spaces"]
---
> **In one line:** LIS finds the longest strictly increasing subsequence, solvable in O(n^2) with DP or O(n log n) with binary search.

## The idea

The **Longest Increasing Subsequence (LIS)** problem finds the length of the longest strictly increasing subsequence within an unsorted array.

Two prominent algorithms exist:
1. **Dynamic Programming ($O(n^2)$):**
   Let `dp[i]` be the length of the LIS ending at index $i$.
   $$dp[i] = 1 + \max(\{dp[j] \mid j < i \text{ and } arr[j] < arr[i]\} \cup \{0\})$$
2. **Patience Sorting with Binary Search ($O(n \log n)$):**
   Maintain an array `tails` where `tails[len]` stores the smallest tail element of all increasing subsequences of length `len + 1`. For each number $x$:
   - Binary search in `tails` for the first element $\ge x$.
   - If found, replace it with $x$ (making the tail smaller!).
   - If $x$ is larger than all tails, append $x$ to extend the LIS!

## See it

Comparing O(n^2) DP with O(n log n) bisect implementation:

```python
import bisect

# Optimal O(n log n) implementation using bisect
def lis_optimal(nums: list[int]) -> int:
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)  # Extends longest subsequence
        else:
            tails[idx] = x   # Lowers tail boundary for length idx + 1
    return len(tails)

sample = [10, 9, 2, 5, 3, 7, 101, 18]
print("LIS length:", lis_optimal(sample))  # Output: 4 ([2, 3, 7, 101])
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

The $O(n \log n)$ algorithm is deeply connected to **Patience Sorting** (a card game): each number is placed on the first card pile where it is smaller than or equal to the top card; if larger than all piles, a new pile is started.

The number of card piles equals the exact length of the Longest Increasing Subsequence! Because `tails` is always strictly sorted, finding the target pile takes $O(\log n)$ with `bisect_left`.

From an algorithmic engineering perspective, understanding the precise operational characteristics of longest increasing subsequence (lis) allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- tails does NOT represent the actual LIS subsequence elements; it only represents the minimal tail values of each length.
- Use bisect_left for strictly increasing subsequences, and bisect_right for non-decreasing subsequences.

## Remember

- LIS can be solved in O(n^2) with standard DP or O(n log n) with patience sorting.
- tails array maintains the smallest tail element for each subsequence length.
- bisect_left enables logarithmic replacement in the tails array.
