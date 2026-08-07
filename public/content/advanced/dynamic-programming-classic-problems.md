---
id: lesson-18
slug: dynamic-programming-classic-problems
title: "Dynamic Programming II: Classic Problems"
level: advanced
order: 18
duration: 32
tags:
  - dynamic-programming
  - lcs
  - edit-distance
  - lis
  - sequence-alignment
---

# Learning Objectives

By the end of this lesson you will be able to:

- Solve the **longest common subsequence (LCS)** with a 2-D DP and reconstruct it.
- Solve **edit (Levenshtein) distance** and explain its three operations.
- Solve the **longest increasing subsequence (LIS)** in `O(n²)`, and know the `O(n log n)` method.
- Distinguish a **subsequence** (not contiguous) from a substring (contiguous).
- Recover the actual optimal sequence, not just its length, by back-tracking the table.

# Why This Concept Exists

The foundations lesson built the DP toolkit; this one applies it to three problems that show
up everywhere. **LCS** and **edit distance** power `diff`, version control, spell-checkers,
and DNA sequence alignment in bioinformatics. **LIS** appears in scheduling and patience
sorting. All three share the same DP shape — a table indexed by prefixes of the input(s) — so
mastering them gives you a template for a whole family of sequence problems.

# Concept Explanation

### Subsequence vs. substring

A **subsequence** keeps the original order but need **not** be contiguous: `"ace"` is a
subsequence of `"abcde"`. A **substring** must be contiguous. LCS and LIS are about
subsequences, which is exactly why brute force (trying all `2ⁿ` subsequences) is hopeless and
DP is needed.

### Longest common subsequence (LCS)

Given strings `X` (length `m`) and `Y` (length `n`), `dp[i][j]` = length of the LCS of the
prefixes `X[:i]` and `Y[:j]`:

```text
dp[i][j] = 0                              if i == 0 or j == 0          (empty prefix)
         = dp[i-1][j-1] + 1               if X[i-1] == Y[j-1]          (extend the match)
         = max(dp[i-1][j], dp[i][j-1])    otherwise                    (drop one char)
```

Filling the `(m+1) × (n+1)` table is `O(mn)` time and space. The answer is `dp[m][n]`; the
actual subsequence is recovered by **back-tracking** from that corner.

### Edit distance (Levenshtein)

The minimum number of single-character **insertions, deletions, and substitutions** to turn
`X` into `Y`. With `dp[i][j]` = edit distance between `X[:i]` and `Y[:j]`:

```text
dp[i][0] = i        (delete i chars)         dp[0][j] = j   (insert j chars)
dp[i][j] = dp[i-1][j-1]                        if X[i-1] == Y[j-1]   (no edit)
         = 1 + min(dp[i-1][j],   # delete
                   dp[i][j-1],   # insert
                   dp[i-1][j-1]) # substitute
```

Also `O(mn)`. It is the engine behind spell-checkers and fuzzy matching.

### Longest increasing subsequence (LIS)

The longest subsequence whose values strictly increase. The `O(n²)` DP: `L[i]` = length of
the longest increasing subsequence **ending at** index `i`, taken as `1 + max(L[j])` over all
`j < i` with `a[j] < a[i]`. The answer is `max(L)`. There is also an elegant `O(n log n)`
method using binary search (`bisect`) over a "tails" array — the same idea as patience sorting.

# Key Terminology

- **Subsequence** — order-preserving selection, not necessarily contiguous.
- **LCS** — longest subsequence common to two sequences.
- **Edit / Levenshtein distance** — fewest insert/delete/substitute edits between two strings.
- **LIS** — longest strictly increasing subsequence.
- **Reconstruction** — back-tracking the DP table to recover the optimal sequence itself.

# Complexity

| Problem | Time | Space | Reconstruction |
| ------- | ---- | ----- | -------------- |
| LCS | O(mn) | O(mn) | back-track from dp[m][n] |
| Edit distance | O(mn) | O(mn) → O(min(m,n)) | back-track the operations |
| LIS (DP) | O(n²) | O(n) | follow predecessor links |
| LIS (binary search) | O(n log n) | O(n) | with extra bookkeeping |

# Implementation in Python

```python
def lcs_length(x: str, y: str) -> int:
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1         # extend the match
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]


def edit_distance(x: str, y: str) -> int:
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j],      # delete
                                   dp[i][j - 1],      # insert
                                   dp[i - 1][j - 1])  # substitute
    return dp[m][n]


def lis_length(a: list[int]) -> int:
    if not a:
        return 0
    L = [1] * len(a)                                   # L[i]: LIS ending at i
    for i in range(len(a)):
        for j in range(i):
            if a[j] < a[i]:
                L[i] = max(L[i], L[j] + 1)
    return max(L)
```

# Real World Analogy

Edit distance is what a **spell-checker** computes: "teh" is one edit from "the"
(transpose ≈ two edits, or one substitution away from "tea"), so the checker ranks the
closest dictionary words by fewest edits. LCS is what **`diff`** and version control use to
line up two versions of a file — the longest shared subsequence of lines is the common
backbone, and everything else is an addition or deletion.

# Examples

## Example 1 — Basic: LCS length and table

```python
lcs_length("ABCBDAB", "BDCAB")   # 4  (e.g. "BCAB")
```

```text
      ""  B  D  C  A  B
  ""   0  0  0  0  0  0
   A   0  0  0  0  1  1
   B   0  1  1  1  1  2
   C   0  1  1  2  2  2
   ...                        (dp[m][n] = 4)
```

**Why this is good:** each cell depends only on its top, left, and top-left neighbors — the
recurrence made concrete. The bottom-right cell is the answer, and tracing back the diagonal
`+1` steps recovers the actual subsequence.

## Example 2 — Real-world: edit distance for fuzzy matching

```python
edit_distance("kitten", "sitting")   # 3
# kitten -> sitten (substitute k->s) -> sittin (e->i) -> sitting (insert g)
```

**Why this is good:** it is the canonical Levenshtein example, and the three edits map exactly
to the three operations in the recurrence. This distance underlies autocorrect, DNA alignment,
and record deduplication.

## Example 3 — Best practice / edge case: LIS in O(n log n)

```python
import bisect

def lis_fast(a: list[int]) -> int:
    tails: list[int] = []           # tails[k] = smallest tail of an LIS of length k+1
    for x in a:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)         # x extends the longest subsequence
        else:
            tails[i] = x            # x improves an existing length's tail
    return len(tails)
```

**Why this is good:** it beats the `O(n²)` DP by keeping a sorted `tails` array and binary-
searching each element's place — `O(n log n)`. It shows that a slow DP is sometimes only the
starting point, and structure (here, monotonic tails) can unlock a faster algorithm.

# Common Mistakes

- **Confusing subsequence with substring.** LCS/LIS allow gaps; a substring must be
  contiguous. Solving the wrong problem gives wrong answers.
- **Off-by-one table dimensions.** Use `(m+1) × (n+1)` with the empty-prefix base row/column;
  index the strings as `X[i-1]`, `Y[j-1]`.
- **Forgetting base cases in edit distance.** `dp[i][0] = i` and `dp[0][j] = j` encode
  turning a string into/from the empty string.
- **Trying to reconstruct without stored information.** To recover the sequence (not just its
  length), you must back-track the table or keep predecessor links.

# Best Practices

- Index the DP table by **prefix lengths**; write the recurrence before coding.
- Add an explicit **base row/column** for empty prefixes.
- Reduce space to one or two rows when a cell only needs the previous row.
- Keep back-pointers (or re-derive from the table) when you need the actual optimal sequence.

# Summary

- A subsequence preserves order but not contiguity — the reason these need DP, not scanning.
- **LCS** and **edit distance** are `O(mn)` DPs over prefix-indexed tables.
- **Edit distance** counts insert/delete/substitute operations; base cases handle the empty string.
- **LIS** is `O(n²)` by DP, or `O(n log n)` with a binary-searched tails array.
- Recover the actual sequence by back-tracking the table or following predecessor links.

# Flash Cards

Q: What is the time complexity of the standard LCS dynamic program for strings of length m and n?
A: O(mn) time and O(mn) space, filling an (m+1)×(n+1) table.

Q: How does a subsequence differ from a substring?
A: A subsequence preserves order but need not be contiguous; a substring must be contiguous.

Q: What three operations does edit (Levenshtein) distance count?
A: Single-character insertion, deletion, and substitution.

Q: What are the edit-distance base cases dp[i][0] and dp[0][j]?
A: dp[i][0] = i (delete i characters) and dp[0][j] = j (insert j characters) — the cost of turning a prefix into the empty string or vice versa.

Q: What are the two time complexities for longest increasing subsequence?
A: O(n²) with the basic DP, or O(n log n) using a binary-searched "tails" array.

Q: How do you recover the actual optimal sequence, not just its length?
A: Back-track through the DP table (or follow stored predecessor links) from the answer cell.

# Exercises

### Easy
Compute `edit_distance("sunday", "saturday")` by hand or with the code, and list one sequence
of edits that achieves it.

### Medium
Extend `lcs_length` to return the actual longest common subsequence string by back-tracking
from `dp[m][n]`. What move do you make at a cell where the characters match vs. where they don't?

### Challenging
Reduce the edit-distance algorithm to `O(min(m, n))` space while still returning the correct
distance. Explain why two rows suffice, and what you would lose (and how to recover it) if you
also needed the sequence of operations.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 14
  (dynamic programming), including the LCS problem in detail.
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Chapter 10 (edit distance and sequence DP).
- Jurafsky & Martin, *Speech and Language Processing* — the minimum-edit-distance algorithm
  (a standard reference for Levenshtein in NLP).
