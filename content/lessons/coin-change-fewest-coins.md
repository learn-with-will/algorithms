---
slug: coin-change-fewest-coins
title: "Coin Change: Fewest Coins Formulation"
topic: dynamic-programming
kind: pattern
summary: "Find the minimum coin count to total an amount using unbounded recurrence: dp[a] = min(dp[a - c] + 1)."
tags: ["coin-change", "unbounded-knapsack", "dynamic-programming", "patterns"]
related: ["knapsack-0-1-state-and-space-optimization", "tabulation-bottom-up-dp", "fractional-knapsack-greedy"]
---
> **In one line:** Coin change calculates the minimum coins to make an amount using bottom-up tabulation.

## The idea

Given an integer `amount` and a list of coin `coins`, find the **fewest number of coins** required to make up that amount. You may assume an infinite supply of each coin denomination (Unbounded Knapsack).

Let `dp[a]` be the minimum coins needed to make amount $a$:
- Base case: `dp[0] = 0` (0 coins make amount 0).
- For each amount $a$ from 1 to `amount`:
  $$dp[a] = 1 + \min(\{dp[a - c] \mid c \in coins \text{ and } c \le a\})$$
- If an amount cannot be made by any combination, set `dp[a] = float('inf')`.

> **Watch out:** Greedy coin selection (always picking the largest denomination) **fails** for arbitrary coin systems! For coins `[1, 3, 4]` and amount `6`, greedy picks `4 + 1 + 1` (3 coins), whereas the optimal DP solution is `3 + 3` (2 coins)!

## See it

Bottom-up tabulation for Coin Change:

```python
def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins to make amount 0
    
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
                
    return dp[amount] if dp[amount] != float('inf') else -1

print("Fewest coins for amount 11 with [1, 2, 5]:", coin_change([1, 2, 5], 11))  # 3 (5+5+1)
print("Fewest coins for amount 6 with [1, 3, 4]:  ", coin_change([1, 3, 4], 6))   # 2 (3+3)
```

## Go deeper

This algorithm runs in $O(\text{amount} \cdot |coins|)$ time and $O(\text{amount})$ auxiliary space.

Because `amount` is encoded as a number (requiring only $\approx \log_2(\text{amount})$ bits of input), its running time is proportional to the numeric value rather than the input bit length. In computational complexity theory, this is known as a **pseudo-polynomial time** algorithm.

From an algorithmic engineering perspective, understanding the precise operational characteristics of coin change: fewest coins formulation allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Never use a greedy algorithm for coin change unless the coin system is proven to be canonical (like US currency).
- Initialize the DP table with infinity (or amount + 1) to accurately compute the minimum.

## Remember

- Greedy coin change fails on non-canonical denominations; DP guarantees optimality.
- Recurrence: dp[a] = 1 + min(dp[a - c]) for all valid coins.
- Runs in pseudo-polynomial O(amount * len(coins)) time.
