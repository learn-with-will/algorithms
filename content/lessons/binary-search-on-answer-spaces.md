---
slug: binary-search-on-answer-spaces
title: "Binary Search on Answer Spaces"
topic: recursion-and-searching
kind: pattern
summary: "Find optimal values over monotonic boolean decision predicates using binary search on answer ranges."
tags: ["binary-search", "answer-space", "optimization", "patterns"]
related: ["binary-search-algorithm", "binary-search-off-by-one-traps", "python-bisect-module"]
---
> **In one line:** Binary search over a monotonic answer range turns an optimization problem into logarithmic decision queries.

## The idea

Binary search is not limited to searching arrays. An advanced and powerful algorithmic pattern is **binary search on the answer space**.

This pattern applies whenever an optimization problem satisfies **monotonicity**:
If an answer $x$ is feasible (or valid), then all values $y > x$ (or $y < x$) are also feasible.

```flow
ans: Answer Space [low, high] | range of potential solutions @primary
mid: Candidate Solution | mid = (low + high) // 2 @blue
check: check_feasible(mid)? | boolean predicate test @amber
shift: Halve Range | narrow based on monotonic condition @green
ans -> mid
mid -> check
check -> shift
```

Instead of guessing linearly ($O(K)$), binary search tests the midpoint using a boolean feasibility predicate in $O(\log K)$ trials, where $K$ is the answer range width.

## See it

Computing integer square root using binary search on the answer:

```python
def int_sqrt(x: int) -> int:
    """Find floor(sqrt(x)) without floating point arithmetic."""
    if x < 2:
        return x
    low, high = 1, x // 2
    ans = 1
    
    while low <= high:
        mid = low + (high - low) // 2
        # Monotonic predicate: does mid * mid <= x?
        if mid * mid <= x:
            ans = mid      # Feasible: record candidate and try larger
            low = mid + 1
        else:
            high = mid - 1 # Infeasible: mid is too large
            
    return ans

print("Square root of 25:", int_sqrt(25))  # Output: 5
print("Square root of 35:", int_sqrt(35))  # Output: 5 (floor)
```

## Go deeper

This pattern is the core solution technique for classic optimization challenges:
- **Koko Eating Bananas:** Find minimum eating speed $k$ to finish within $H$ hours.
- **Capacity to Ship Packages Within D Days:** Find minimum ship weight capacity.
- **Split Array Largest Sum:** Find minimum largest subarray sum when split into $m$ pieces.

In all these problems, verifying if a specific candidate capacity works takes simple linear $O(n)$ time. Wrapping that check in binary search yields total runtime $O(n \log(\text{range}))$, turning an intractable problem into an instantaneous calculation.

From an algorithmic engineering perspective, understanding the precise operational characteristics of binary search on answer spaces allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Ensure the feasibility predicate is strictly monotonic; if the predicate toggles True/False haphazardly, binary search fails.
- Carefully establish low and high bounds so the true optimal answer is never excluded from the initial search window.

## Remember

- Applies to optimization problems with monotonic boolean feasibility predicates.
- Replaces costly search with O(log(range)) feasibility tests.
- Widely used in capacity planning, rate limiting, and partition optimization.
