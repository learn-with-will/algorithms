---
slug: n-queens-placement-and-pruning
title: "N-Queens Placement and Pruning"
topic: greedy-and-backtracking
kind: technique
summary: "Solve N-Queens by placing queens row by row while pruning columns and diagonals under attack in O(1) checks."
tags: ["n-queens", "pruning", "backtracking", "diagonals"]
related: ["backtracking-search-state-space", "state-restoration-the-unchoose-step", "generate-permutations"]
---
> **In one line:** Solve N-Queens by placing queens row-by-row and pruning columns and diagonals in O(1) time.

## The idea

The **$N$-Queens Problem** challenges you to place $N$ non-attacking queens on an $N \times N$ chessboard such that no two queens share the same row, column, or diagonal.

Because each row must contain exactly one queen, we place queens row by row:
- At row $r$, try placing a queen in column $c$ for $c \in [0, N-1]$.
- Prune immediately if column $c$ or either diagonal is already under attack!

How to track diagonals in $O(1)$ time?
- **Major Diagonals (\):** Every square on the same top-left to bottom-right diagonal has a constant difference: $r - c$.
- **Minor Diagonals (/):** Every square on the same top-right to bottom-left diagonal has a constant sum: $r + c$.

Using lookup sets for `cols`, `diag1 (r - c)`, and `diag2 (r + c)` allows checking validity in instantaneous $O(1)$ time!

## See it

Complete N-Queens solver in Python:

```python
def solve_n_queens(n: int) -> list[list[str]]:
    solutions = []
    cols, diag1, diag2 = set(), set(), set()
    queens = []
    def backtrack(r: int):
        if r == n:
            solutions.append(["." * c + "Q" + "." * (n - c - 1) for c in queens])
            return
        for c in range(n):
            if c in cols or (r - c) in diag1 or (r + c) in diag2:
                continue
            cols.add(c); diag1.add(r - c); diag2.add(r + c)
            queens.append(c)
            backtrack(r + 1)
            queens.pop()
            cols.remove(c); diag1.remove(r - c); diag2.remove(r + c)
    backtrack(0)
    return solutions

print("Solutions for 4-Queens:", len(solve_n_queens(4)))  # 2
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

For $N = 8$, there are 92 distinct solutions (12 fundamental solutions up to rotation and reflection). 

Because the row-by-row design automatically satisfies row constraints, the search space reduces from $\binom{64}{8} \approx 4.4 \times 10^9$ down to $8! = 40,320$ permutations, and diagonal pruning slashes this further to only $15,720$ states. Backtracking solves the 8-Queens problem in less than 5 milliseconds!

From an algorithmic engineering perspective, understanding the precise operational characteristics of n-queens placement and pruning allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Be sure to clean up all three tracking sets (cols, diag1, diag2) during the un-choose backtracking step.
- Diagonals r - c can be negative; Python sets handle negative integer keys naturally.

## Remember

- Place queens row-by-row to satisfy row constraints automatically.
- Diagonals are identified in O(1) by constant r - c and r + c sums.
- Pruning invalid diagonals collapses search complexity by orders of magnitude.
