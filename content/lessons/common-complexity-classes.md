---
slug: common-complexity-classes
title: "Common Complexity Classes"
topic: algorithmic-foundations
kind: concept
summary: "Compare the growth hierarchy from constant O(1) and logarithmic O(log n) to polynomial and exponential time."
tags: ["complexity-classes", "growth-rates", "big-o", "performance"]
related: ["asymptotic-notation-big-o", "omega-and-theta-notation", "space-complexity-and-auxiliary-memory"]
---
> **In one line:** Growth rates dictate scalability: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n).

## The idea

Algorithms are grouped into standard asymptotic complexity classes that govern practical scalability:

| Class | Name | Operations ($n = 10^6$) | Typical Example |
|---|---|---|---|
| $O(1)$ | Constant | $1$ | Array indexing, hash table lookup |
| $O(\log n)$ | Logarithmic | $\approx 20$ | Binary search, balanced BST search |
| $O(n)$ | Linear | $10^6$ | Single pass scan, counting elements |
| $O(n \log n)$ | Linearithmic | $\approx 2 \times 10^7$ | Merge sort, Heapsort, Timsort |
| $O(n^2)$ | Quadratic | $10^{12}$ (seconds/minutes) | Bubble sort, nested pairwise loop |
| $O(2^n)$ | Exponential | $> 10^{300000}$ (infeasible) | Generating all subsets, brute-force TSP |

An $O(n \log n)$ algorithm completes $10^6$ items in fractions of a second, whereas an $O(n^2)$ algorithm requires trillions of operations, stalling systems.

## See it

Demonstrating growth rate divergence in Python:

```python
import math

n_values = [10, 100, 1000]

print(f"{'n':<6} | {'log2(n)':<8} | {'n*log2(n)':<10} | {'n^2':<10}")
print("-" * 42)
for n in n_values:
    log_v = math.log2(n)
    n_log = n * log_v
    n_sq = n ** 2
    print(f"{n:<6} | {log_v:<8.1f} | {n_log:<10.1f} | {n_sq:<10}")
```

## Go deeper

The gap between polynomial time ($O(n^k)$) and exponential time ($O(2^n)$) forms the cornerstone of theoretical computer science (P versus NP).

Algorithms scaling exponentially become unusable even for modest inputs like $n = 50$. When dealing with combinatorial problems, finding polynomial approximations or pruning search spaces via dynamic programming is essential.

Even within polynomial time, moving from $O(n^2)$ to $O(n \log n)$ is the difference between an application responding instantly or timing out under web traffic.

From an algorithmic engineering perspective, understanding the precise operational characteristics of common complexity classes allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Logarithmic algorithms O(log n) scale so efficiently that doubling the input size only adds a constant number of steps.
- Do not assume O(n^2) algorithms are acceptable in production when inputs can exceed 10^4 items.

## Remember

- Asymptotic hierarchy: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n).
- Hardware speedups cannot overcome exponential asymptotic growth curves.
- Target O(n log n) or better for algorithms processing large production datasets.
