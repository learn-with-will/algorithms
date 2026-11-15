---
slug: greedy-choice-property
title: "The Greedy-Choice Property"
topic: greedy-and-backtracking
kind: concept
summary: "An algorithm is greedy if globally optimal solutions can be reached by making locally optimal choices at each step."
tags: ["greedy", "greedy-choice", "optimization", "theory"]
related: ["activity-selection-problem", "fractional-knapsack-greedy", "when-greedy-fails-vs-dp"]
---
> **In one line:** A greedy algorithm arrives at a globally optimal solution by making locally optimal choices at every step.

## The idea

A **greedy algorithm** builds a solution piece by piece, always choosing the next piece that offers the most immediate, obvious benefit at that exact moment — a **locally optimal choice** — in the hope that this will lead to a **globally optimal solution**.

For a greedy algorithm to be correct, a problem must satisfy two strict properties:

| Property | Meaning | Consequence |
|---|---|---|
| **Greedy-Choice Property** | A globally optimal solution can be assembled via local greedy decisions. | No need to reconsider past choices; zero backtracking. |
| **Optimal Substructure** | An optimal solution contains optimal subproblem solutions within it. | Solving the remaining subproblem after the greedy choice yields optimality. |

Unlike Dynamic Programming (which solves all subproblems before choosing), a greedy algorithm makes its choice **first**, before solving downstream subproblems.

## See it

Comparing greedy choice with dynamic programming:

```flow
p: Subproblem State | current decision point @primary
greedy: Greedy Choice | picks best local option immediately @green
dp: Dynamic Programming | evaluates all options, picks max @blue
sub: Next Subproblem | smaller subproblem remaining @amber
p -> greedy: Greedy makes choice FIRST
greedy -> sub
p -> dp: DP evaluates ALL choices
dp -> sub
```

Greedily picking the largest available denomination:

```python
def greedy_coin_change(coins: list[int], amount: int) -> list[int]:
    coins.sort(reverse=True)
    result = []
    for coin in coins:
        while amount >= coin:
            result.append(coin)
            amount -= coin
    return result

print(greedy_coin_change([25, 10, 5, 1], 67))  # [25, 25, 10, 5, 1, 1]
```

## Go deeper

Proving that a greedy choice is optimal almost always uses an **exchange argument**:

1. Assume there exists an optimal solution $O$ that differs from our greedy solution $G$.
2. Identify the first choice where $O$ deviates from $G$.
3. "Exchange" that choice in $O$ with the greedy choice, and prove that the modified solution $O'$ is still valid and has a total score at least as good as $O$.
4. By mathematical induction, we can transform $O$ into $G$ without losing optimality, proving the greedy algorithm is optimal.

From an algorithmic engineering perspective, understanding the precise operational characteristics of the greedy-choice property allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Greedy algorithms feel intuitive and easy to write, but are notoriously difficult to prove correct.
- Never assume a greedy heuristic works without a formal proof or rigorous verification against counterexamples.

## Remember

- Greedy algorithms make locally optimal choices with zero backtracking.
- Requires both the greedy-choice property and optimal substructure.
- Correctness is formally established using the greedy exchange argument.
