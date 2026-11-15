---
slug: knapsack-0-1-state-and-space-optimization
title: "The 0/1 Knapsack Problem and Space Reduction"
topic: dynamic-programming
kind: pattern
summary: "Solve 0/1 knapsack using 2D state transitions, then optimize memory to 1D by iterating capacities backward."
tags: ["knapsack", "dynamic-programming", "space-optimization", "patterns"]
related: ["tabulation-bottom-up-dp", "coin-change-fewest-coins", "fractional-knapsack-greedy"]
---
> **In one line:** The 0/1 knapsack problem balances item values against capacity, optimized to 1D memory by iterating backwards.

## The idea

In the **0/1 Knapsack Problem**, you are given $n$ items, each with weight $w_i$ and value $v_i$, and a knapsack of maximum capacity $W$. For each item, you must make a binary choice: either **take it (1)** or **leave it (0)**. Maximize total value without exceeding capacity $W$.

Let `dp[i][c]` be the maximum value achievable using a subset of the first $i$ items with capacity $c$:
- If item $i$ is not included: `dp[i][c] = dp[i-1][c]`.
- If item $i$ is included (requires $w_i \le c$): `dp[i][c] = dp[i-1][c - w_i] + v_i`.

$$\text{dp}[i][c] = \max(\text{dp}[i-1][c], \text{dp}[i-1][c - w_i] + v_i)$$

```flow
item: Consider Item i | weight w, value v @primary
skip: Option 1: Skip Item | keep value dp[i-1][c] @blue
take: Option 2: Take Item | add v to dp[i-1][c - w] @amber
max: Take Maximum | dp[i][c] = max(skip, take) @green
item -> skip
item -> take
skip -> max
take -> max
```

## See it

Space-optimized 1D array implementation:

```python
def knapsack_01(weights: list[int], values: list[int], capacity: int) -> int:
    # 1D array of size capacity + 1 (all initialized to 0)
    dp = [0] * (capacity + 1)
    
    for w, v in zip(weights, values):
        # Traverse capacity BACKWARD to prevent using the same item multiple times!
        for c in range(capacity, w - 1, -1):
            dp[c] = max(dp[c], dp[c - w] + v)
            
    return dp[capacity]

w_items = [2, 3, 4, 5]
v_items = [3, 4, 5, 8]
cap = 5
print("Max knapsack value:", knapsack_01(w_items, v_items, cap))  # Output: 8 (w=5, v=8)
```

## Go deeper

Why MUST capacity be traversed **backward** in the 1D space-optimized version?

If you iterated capacity forward ($c$ from $w$ to $W$), `dp[c - w]` would already reflect the updated value for item $i$, allowing item $i$ to be picked multiple times (solving the *Unbounded Knapsack* problem instead!). 

Iterating backward guarantees that `dp[c - w]` still holds the value from the previous item $i - 1$, preserving the strict 0/1 constraint with only **$O(W)$ auxiliary space**.

From an algorithmic engineering perspective, understanding the precise operational characteristics of the 0/1 knapsack problem and space reduction allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Greedy selection (taking highest value/weight ratio) fails on 0/1 Knapsack; DP is strictly required.
- Iterating forward in a 1D DP array inadvertently solves the unbounded knapsack problem.

## Remember

- 0/1 Knapsack balances item weights and values against capacity limit W.
- Standard 2D table uses O(n * W) time and space.
- Iterating capacities backward compresses memory to a single 1D array of size W.
