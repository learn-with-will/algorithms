---
slug: generate-subsets-and-combinations
title: "Generating Subsets and Combinations"
topic: greedy-and-backtracking
kind: pattern
summary: "Generate all 2^n subsets by branching on whether to include or exclude each element at each decision step."
tags: ["subsets", "combinations", "backtracking", "power-set"]
related: ["backtracking-search-state-space", "generate-permutations", "state-restoration-the-unchoose-step"]
---
> **In one line:** Generate all 2^n subsets using a binary decision tree: include or exclude each element.

## The idea

The **power set** of a set $S$ is the set of all possible subsets, containing exactly $2^n$ elements (including the empty set and $S$ itself).

Backtracking generates all subsets using a simple binary decision tree: for each element $A[i]$:
1. **Branch 1 (Include):** Append $A[i]$ to the current candidate subset, and recurse for remaining elements.
2. **Branch 2 (Exclude):** Do not append $A[i]$, and recurse for remaining elements.

```tree
Decision Tree for [1, 2]
  Root: []
    Include 1: [1]
      Include 2: [1, 2]
      Exclude 2: [1]
    Exclude 1: []
      Include 2: [2]
      Exclude 2: []
```

Runs in optimal $\Theta(n \cdot 2^n)$ time, generating all $2^n$ subsets of length up to $n$.

## See it

Generating all subsets in Python:

```python
def generate_subsets(nums: list[int]) -> list[list[int]]:
    result = []
    current_path = []
    
    def backtrack(start_idx: int):
        # Every path generated represents a valid subset!
        result.append(list(current_path))
        
        for i in range(start_idx, len(nums)):
            current_path.append(nums[i])    # Choose
            backtrack(i + 1)                 # Explore
            current_path.pop()               # Un-choose
            
    backtrack(0)
    return result

print("Subsets of [1, 2]:", generate_subsets([1, 2]))  # [[], [1], [1, 2], [2]]
```

## Go deeper

Notice that `result.append(list(current_path))` creates a **shallow copy** of `current_path`. 

If you wrote `result.append(current_path)`, Python would append a reference to the mutable list, which is later modified and emptied by subsequent `pop()` operations, resulting in an output filled entirely with empty lists!

From an algorithmic engineering perspective, understanding the precise operational characteristics of generating subsets and combinations allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Always append a copy of current_path (e.g. list(current_path) or current_path[:]), not the mutable list reference.
- Pass i + 1 to the recursive call to ensure combinations do not reuse elements or duplicate subsets.

## Remember

- A set of size n has exactly 2^n distinct subsets.
- Backtracking branches on including or excluding each candidate element.
- Always append a copy of the candidate path to the results collection.
