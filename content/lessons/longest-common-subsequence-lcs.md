---
slug: longest-common-subsequence-lcs
title: "Longest Common Subsequence (LCS)"
topic: dynamic-programming
kind: pattern
summary: "Find the longest matching subsequence across two strings using a 2D matrix dynamic programming formulation."
tags: ["lcs", "subsequence", "dynamic-programming", "string-algorithms"]
related: ["reconstructing-dp-solutions", "edit-distance-levenshtein", "longest-increasing-subsequence-lis"]
---
> **In one line:** LCS finds the longest shared subsequence of characters appearing in the same relative order.

## The idea

A **subsequence** is derived from a string by deleting zero or more characters without changing the relative order of the remaining characters.

Given two strings $X$ of length $m$ and $Y$ of length $n$, the **Longest Common Subsequence (LCS)** problem finds the maximum length of a subsequence common to both.

Let `dp[i][j]` be the length of LCS of prefixes $X[0..i-1]$ and $Y[0..j-1]$:
1. If $X[i-1] == Y[j-1]$: characters match!
   $$dp[i][j] = dp[i-1][j-1] + 1$$
2. If $X[i-1] \neq Y[j-1]$: mismatch. Discard either $X[i-1]$ or $Y[j-1]$:
   $$dp[i][j] = \max(dp[i-1][j], dp[i][j-1])$$

| Case | Recurrence Transition | Meaning |
|---|---|---|
| **Match** | `dp[i-1][j-1] + 1` | Extend matching subsequence by 1. |
| **Mismatch** | `max(dp[i-1][j], dp[i][j-1])` | Take best match from skipping a character. |

Runs in strictly **$O(m \cdot n)$ time and space**.

## See it

LCS length calculation in Python:

```python
def lcs_length(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    # Initialize 2D table of size (m+1) x (n+1) with 0s
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]

print("LCS length of 'ABCDE' and 'ACE':", lcs_length("ABCDE", "ACE"))  # Output: 3 ('ACE')
```

## Go deeper

LCS forms the foundational algorithmic core of:
- **`diff` Utilities and Git Merge:** Identifying added and deleted lines of code between file revisions.
- **Bioinformatics:** Aligning DNA sequences (e.g. matching `AGCTGAC` and `ACTGA`) to identify genetic homology.

Because $dp[i]$ depends only on row $i-1$, the length calculation can be space-optimized to $O(n)$ using two rolling rows.

From an algorithmic engineering perspective, understanding the precise operational characteristics of longest common subsequence (lcs) allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Do not confuse substring (must be contiguous) with subsequence (can be non-contiguous).
- Table dimensions must be (m + 1) x (n + 1) to accommodate empty string base cases.

## Remember

- LCS finds the longest non-contiguous sequence common to both strings.
- Matching characters extend diagonal dp[i-1][j-1] by 1.
- Powers git diff, version control merging, and DNA sequence alignment.
