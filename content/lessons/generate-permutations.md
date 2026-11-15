---
slug: generate-permutations
title: "Generating Permutations"
topic: greedy-and-backtracking
kind: pattern
summary: "Generate all n! permutations systematically by maintaining used tracking sets or swapping elements in-place."
tags: ["permutations", "backtracking", "combinatorics", "recursion"]
related: ["backtracking-search-state-space", "generate-subsets-and-combinations", "state-restoration-the-unchoose-step"]
---
> **In one line:** Generate all n! permutations by maintaining a tracking set of used elements or swapping in-place.

## The idea

A **permutation** is an ordered arrangement of all $n$ elements in a collection. For $n$ distinct elements, there are exactly $n!$ distinct permutations ($n \times (n-1) \times \dots \times 1$).

Backtracking builds permutations by placing elements one slot at a time:
- At step $k$, any element that has **not yet been used** can be placed in slot $k$.
- Track which elements are already in the current candidate path using a boolean lookup set.
- When the candidate path reaches length $n$, record the complete permutation.

Runs in optimal $\Theta(n \cdot n!)$ time.

## See it

Generating all permutations in Python:

```python
def permute(nums: list[int]) -> list[list[int]]:
    result = []
    path = []
    used = [False] * len(nums)
    
    def backtrack():
        if len(path) == len(nums):
            result.append(list(path))
            return
            
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True         # Choose
                path.append(nums[i])
                backtrack()            # Explore
                path.pop()             # Un-choose
                used[i] = False
                
    backtrack()
    return result

print("Permutations of [1, 2, 3]:", len(permute([1, 2, 3])))  # Output: 6 (3!)
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

An alternative elegant technique generates permutations strictly **in-place** via element swapping:
```python
def permute_inplace(arr, start=0):
    if start == len(arr):
        yield list(arr)
        return
    for i in range(start, len(arr)):
        arr[start], arr[i] = arr[i], arr[start]  # Swap
        yield from permute_inplace(arr, start + 1)
        arr[start], arr[i] = arr[i], arr[start]  # Un-swap!
```
This in-place swapping algorithm avoids the auxiliary `used` array entirely, consuming only $O(n)$ recursion stack memory.

From an algorithmic engineering perspective, understanding the precise operational characteristics of generating permutations allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- If input contains duplicates, sort the array first and skip adjacent duplicate elements to avoid duplicate permutations.
- Factorial growth n! is explosive; generating permutations for n > 12 will exhaust system memory.

## Remember

- A collection of n distinct items has exactly n! permutations.
- Track used items with a boolean array or swap elements in-place.
- Remember to un-choose (unmark used and pop path) on backtrack.
