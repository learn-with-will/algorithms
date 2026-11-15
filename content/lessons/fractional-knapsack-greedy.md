---
slug: fractional-knapsack-greedy
title: "The Fractional Knapsack Problem"
topic: greedy-and-backtracking
kind: technique
summary: "Greedily take items with the highest value-to-weight ratio when items can be arbitrarily divided."
tags: ["fractional-knapsack", "greedy", "optimization", "value-density"]
related: ["greedy-choice-property", "knapsack-0-1-state-and-space-optimization", "when-greedy-fails-vs-dp"]
---
> **In one line:** Fractional knapsack sorts items by value-to-weight density, greedily packing the most valuable density first.

## The idea

In the **Fractional Knapsack Problem**, you have a knapsack of capacity $W$ and $n$ items, each with weight $w_i$ and value $v_i$. 

Unlike the 0/1 Knapsack problem (where you must take whole items), items here are continuous substances (like gold dust, flour, or oil) that can be **broken into arbitrary fractions** $x_i \in [0, 1]$.

Because items can be divided:
1. Compute the **value density** (value per unit weight) for each item: $r_i = v_i / w_i$.
2. Sort items in descending order of value density: $r_1 \ge r_2 \ge \dots \ge r_n$.
3. Greedily take as much of the highest-density item as will fit.
4. When an item cannot fit completely, take the fraction that fills the remaining knapsack capacity.

## See it

Implementation of Fractional Knapsack:

```python
def fractional_knapsack(weights: list[float], values: list[float], capacity: float) -> float:
    # Pair items as (value, weight, density)
    items = sorted([(v, w, v / w) for v, w in zip(values, weights)], 
                   key=lambda x: x[2], reverse=True)
    
    total_val = 0.0
    remaining_cap = capacity
    
    for v, w, density in items:
        if remaining_cap <= 0:
            break
        take_weight = min(w, remaining_cap)
        total_val += take_weight * density
        remaining_cap -= take_weight
        
    return total_val

w_items = [10.0, 20.0, 30.0]
v_items = [60.0, 100.0, 120.0]  # Densities: 6.0, 5.0, 4.0
print("Max fractional value for cap=50:", fractional_knapsack(w_items, v_items, 50.0))  # 240.0
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

Why does the greedy strategy succeed for Fractional Knapsack but fail for 0/1 Knapsack?

In Fractional Knapsack, every kilogram of capacity used on lower-density items leaves less room for higher-density items. Because items are divisible, you never "waste" capacity with empty gaps. In 0/1 knapsack, taking a high-density item might leave an unusable gap, making a combination of lower-density items superior overall.

From an algorithmic engineering perspective, understanding the precise operational characteristics of the fractional knapsack problem allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Never use the greedy value-density strategy for 0/1 Knapsack; it will frequently produce wrong answers.
- Ensure floating-point division is used when calculating value densities.

## Remember

- Fractional knapsack permits taking partial items (continuous quantities).
- Sorting by value-to-weight density (v / w) yields optimal O(n log n) results.
- Demonstrates how problem divisibility determines whether Greedy beats DP.
