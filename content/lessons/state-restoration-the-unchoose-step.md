---
slug: state-restoration-the-unchoose-step
title: "State Restoration: The Un-Choose Step"
topic: greedy-and-backtracking
kind: pitfall
summary: "Failing to reverse mutations before returning from recursive calls corrupts state for subsequent search branches."
tags: ["un-choose", "state-restoration", "backtracking", "pitfalls"]
related: ["backtracking-search-state-space", "generate-subsets-and-combinations", "n-queens-placement-and-pruning"]
---
> **In one line:** Every choice made before recursing must be cleanly undone in the un-choose step upon return.

## The idea

The most frequent bug in backtracking code is **state corruption**: modifying a shared data structure (like a list, set, or grid) when going down a branch, but failing to completely reverse that mutation when backtracking.

Backtracking relies on a strict invariant:
When a recursive call returns to its parent caller, the state of all data structures must be **identical** to what it was before the call was made!

```python
path.append(choice)      # 1. Choose (mutate state)
backtrack()              # 2. Explore
path.pop()               # 3. Un-choose (MANDATORY RESTORATION!)
```

If the un-choose step is omitted or incomplete, subsequent branches inherit stale, corrupted state, causing valid solutions to be skipped or invalid solutions to be generated.

## See it

Symmetric choose and un-choose state restoration:

```python
def generate_permutations(nums: list[int]) -> list[list[int]]:
    result = []
    path = []
    used = [False] * len(nums)
    def backtrack():
        if len(path) == len(nums):
            result.append(list(path))
            return
        for i, val in enumerate(nums):
            if not used[i]:
                used[i] = True; path.append(val)  # 1. Choose
                backtrack()                       # 2. Explore
                path.pop(); used[i] = False       # 3. Un-choose
    backtrack()
    return result

print(generate_permutations([1, 2, 3]))
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

In languages with immutable persistent data structures (like Clojure or Haskell), the un-choose step is unnecessary because creating a new branch returns a new immutable version without mutating the parent state.

However, in Python and C++, mutating and restoring a single shared data structure in-place takes $O(1)$ operations, avoiding the heavy memory allocations of cloning data structures on every branch.

From an algorithmic engineering perspective, understanding the precise operational characteristics of state restoration: the un-choose step allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Every append must have a matching pop; every set.add must have a matching set.remove.
- If an exception can occur during exploration, use try...finally to guarantee state restoration.

## Remember

- Backtracking requires strictly symmetric Choose and Un-choose operations.
- Mutating shared state in-place achieves optimal O(1) branch transitions.
- Failing to restore state corrupts all subsequent search tree explorations.
