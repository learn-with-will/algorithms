---
id: lesson-23
slug: backtracking
title: "Backtracking"
level: advanced
order: 23
duration: 30
tags:
  - backtracking
  - n-queens
  - permutations
  - search
  - pruning
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe **backtracking** as incremental search with **pruning**.
- Apply the **choose → explore → un-choose** template.
- Generate subsets and permutations by backtracking.
- Solve the **N-Queens** problem and see how pruning shrinks the search.
- Reason about the (exponential) size of a backtracking search space.

# Why This Concept Exists

Some problems ask you to find a valid configuration — an arrangement of queens, a filled
Sudoku grid, a subset summing to a target — where the only sure method is to *search* the space
of possibilities. That space is usually exponential, so brute force (build every possibility,
then test it) is hopeless. **Backtracking** is smart brute force: it builds candidates one
choice at a time and **abandons a partial candidate the moment it cannot possibly succeed**,
pruning away enormous branches before exploring them. It is the workhorse for constraint-
satisfaction and combinatorial-generation problems.

# Concept Explanation

### The idea: build incrementally, prune early

Backtracking explores a **tree of partial solutions**. At each node you extend the current
partial solution by one choice; if the extension violates a constraint, you **prune** — do not
recurse into that branch — and try the next choice. When a partial solution is complete and
valid, you record it. When you run out of choices at a node, you **backtrack** to the previous
node and try its next option.

### The template: choose → explore → un-choose

Every backtracking algorithm has the same shape:

```text
def backtrack(state):
    if state is a complete solution:
        record it; return
    for each choice that is currently valid (prune invalid ones):
        apply the choice        # choose
        backtrack(extended state)   # explore
        undo the choice         # un-choose (backtrack)
```

The **un-choose** step is essential: it restores the state so the next choice starts clean.
Forgetting it is the most common backtracking bug.

### Pruning is what makes it fast

Without pruning, backtracking degenerates into brute force over all possibilities — `2ⁿ`
subsets, `n!` permutations, exponential game trees. **Pruning** — skipping choices that already
violate a constraint — is what cuts the explored tree from astronomically large to tractable.
The N-Queens search space is enormous, but rejecting a queen placement the instant it is
attacked prunes the vast majority of it.

### Complexity

Backtracking is **exponential in the worst case** because the underlying search space is —
`O(2ⁿ)` for subsets, `O(n! · n)` for permutations, exponential for N-Queens. Pruning improves
the *practical* running time dramatically but does not change the worst-case class. Backtracking
is used when no polynomial algorithm is known and the pruned search is fast enough in practice.

# Key Terminology

- **Backtracking** — incremental search that undoes choices when they fail.
- **Partial solution / state** — the choices made so far.
- **Prune** — reject a branch that cannot lead to a valid solution.
- **Choose / un-choose** — apply a choice / undo it before trying the next.
- **Search space** — the set of all candidate solutions (usually exponential).

# Complexity

| Problem | Search space | Notes |
| ------- | ------------ | ----- |
| All subsets | O(2ⁿ) | each element in or out |
| All permutations | O(n! · n) | n! orderings, O(n) to build each |
| N-Queens | exponential | pruning by column/diagonal makes it practical |
| Sudoku | exponential | constraint pruning solves real puzzles fast |

# Implementation in Python

```python
# --- All subsets (the power set) ---
def subsets(nums: list[int]) -> list[list[int]]:
    result: list[list[int]] = []
    path: list[int] = []
    def backtrack(start: int) -> None:
        result.append(path[:])            # every node is a valid subset
        for i in range(start, len(nums)):
            path.append(nums[i])          # choose
            backtrack(i + 1)              # explore
            path.pop()                    # un-choose
    backtrack(0)
    return result


# --- N-Queens: count solutions, pruning attacked squares ---
def n_queens(n: int) -> int:
    cols, diag1, diag2 = set(), set(), set()
    count = 0
    def place(row: int) -> None:
        nonlocal count
        if row == n:                      # all n queens placed
            count += 1
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue                  # prune: this square is attacked
            cols.add(col); diag1.add(row - col); diag2.add(row + col)   # choose
            place(row + 1)                                              # explore
            cols.discard(col); diag1.discard(row - col); diag2.discard(row + col)  # un-choose
    place(0)
    return count
```

# Real World Analogy

Backtracking is solving a **maze with a ball of string**. You walk down a corridor (a choice),
unspooling string. At a dead end you do not start over — you **walk back** along the string to
the last junction (backtrack) and try a different corridor. Pruning is noticing "that corridor
is blocked by a locked gate" and not bothering to walk down it at all. The string is your
un-choose: it always returns you to a clean decision point.

# Examples

## Example 1 — Basic: all permutations

```python
def permutations(nums: list[int]) -> list[list[int]]:
    result, path, used = [], [], [False] * len(nums)
    def backtrack() -> None:
        if len(path) == len(nums):
            result.append(path[:]); return
        for i in range(len(nums)):
            if used[i]:
                continue                  # prune: already placed
            used[i] = True; path.append(nums[i])     # choose
            backtrack()                               # explore
            path.pop(); used[i] = False               # un-choose
    backtrack()
    return result

permutations([1, 2, 3])   # 6 permutations
```

**Why this is good:** it is the template in its purest form. The `used` array prunes the branch
that would reuse an element, and the paired `choose`/`un-choose` keep `path` and `used`
consistent as the recursion explores and retreats.

## Example 2 — Real-world: N-Queens

```python
n_queens(8)    # 92  distinct solutions on an 8x8 board
```

**Why this is good:** brute force would try 64-choose-8 placements; backtracking places one
queen per row and prunes any square already attacked on a column or diagonal, collapsing the
search to something a computer solves instantly. It is the canonical demonstration that pruning,
not raw enumeration, is what makes the search feasible.

## Example 3 — Best practice / edge case: the un-choose step

```python
# BUG: forgetting to undo the choice corrupts state for sibling branches
def broken(nums, path=[]):
    if len(path) == len(nums):
        print(path)
        return
    for x in nums:
        if x in path:
            continue
        path.append(x)     # choose
        broken(nums, path) # explore
        # MISSING: path.pop()  -> path never shrinks, results are wrong
```

**Why this is good:** it shows the single most common backtracking mistake. Without the
`un-choose` (`path.pop()`), the shared `path` keeps growing and the sibling branches see dirty
state. Every `choose` must be matched by an `un-choose`.

# Common Mistakes

- **Forgetting to un-choose.** Not undoing a choice leaves dirty state for the next branch —
  the top backtracking bug.
- **No pruning.** Without rejecting invalid partial solutions early, backtracking is just brute
  force and may be far too slow.
- **Recording references, not copies.** Appending the mutable `path` itself (instead of
  `path[:]`) stores a reference that later mutations corrupt.
- **Pruning too aggressively.** Cutting a branch that *could* still succeed makes the search
  miss valid solutions — prune only on genuine constraint violations.

# Best Practices

- Follow the **choose → explore → un-choose** template exactly; match every choose with an undo.
- **Prune as early as possible** — check constraints before recursing, not after building a full candidate.
- Append **copies** of the current path when recording solutions.
- Use fast membership sets (columns, diagonals) so each pruning check is `O(1)`.

# Summary

- Backtracking is incremental search that **abandons** partial solutions that cannot succeed.
- The template is **choose → explore → un-choose**; the undo step is mandatory.
- **Pruning** invalid branches early is what makes an exponential search practical.
- Worst-case time is exponential (`2ⁿ` subsets, `n!` permutations), matching the search space.
- It is the go-to method for constraint satisfaction (N-Queens, Sudoku) and combinatorial generation.

# Flash Cards

Q: What is backtracking?
A: An incremental search that builds candidates one choice at a time and abandons (backtracks on) any partial candidate that cannot lead to a valid solution.

Q: What is the standard backtracking template?
A: choose → explore (recurse) → un-choose (undo the choice), trying each valid option in turn.

Q: Why is the un-choose step essential?
A: It restores the state so sibling branches start clean; skipping it leaves dirty state and produces wrong results.

Q: What role does pruning play in backtracking?
A: It rejects branches that already violate constraints, cutting the explored search tree from exponential brute force to something tractable.

Q: What is the size of the search space for all subsets and all permutations of n elements?
A: 2ⁿ subsets and n! permutations — both exponential, which is why pruning matters.

Q: How does N-Queens prune its search?
A: It places one queen per row and skips any square already attacked on a column or diagonal, discarding most of the search tree.

# Exercises

### Easy
Modify `subsets` to generate only subsets of a fixed size `k` (combinations). What pruning
condition lets you stop early?

### Medium
Write a backtracking solver for **combination sum**: given candidates and a target, find all
combinations (each candidate reusable) that sum to the target. Prune branches whose running sum
exceeds the target.

### Challenging
Write a Sudoku solver using backtracking: find the first empty cell, try digits 1–9 that do not
violate the row/column/box constraints, recurse, and undo on failure. Explain how constraint
pruning keeps it fast on real puzzles.

# Further Reading

- Skiena, *The Algorithm Design Manual*, 3rd ed. — Chapter 9 ("Combinatorial Search"),
  the definitive practical treatment of backtracking and pruning.
- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — backtracking appears
  in the exploration of exhaustive search and NP-complete problems (Chapter 34).
- Python — [`itertools`](https://docs.python.org/3/library/itertools.html) provides
  `permutations`, `combinations`, and `product` when you just need to *enumerate* (no custom pruning).
