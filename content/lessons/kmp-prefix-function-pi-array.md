---
slug: kmp-prefix-function-pi-array
title: "KMP Prefix Function (Pi Array)"
topic: string-matching
kind: concept
summary: "Precompute the longest proper prefix that is also a suffix for every prefix of the pattern in linear time."
tags: ["algorithms", "strings", "kmp", "prefix-function", "pi-array"]
related: ["naive-string-matching-scan", "kmp-search-linear-time-matching", "string-matching-algorithm-selection"]
---
> **In one line:** The KMP prefix function computes the length of the longest proper prefix that is also a suffix for each prefix of the pattern.

## The idea

The core engine of the Knuth-Morris-Pratt (KMP) algorithm is the **prefix function**, commonly denoted as $\pi$ or `lps` (Longest Proper Prefix which is also a Suffix). For a pattern $P$ of length $m$, $\pi[i]$ stores the length of the longest proper prefix of $P[0 \dots i]$ that matches a suffix of $P[0 \dots i]$.

A "proper prefix" of a string is a prefix that is not equal to the string itself. For example, in the pattern `"ABABC"`:
- For `"A"`, $\pi[0] = 0$.
- For `"AB"`, $\pi[1] = 0$.
- For `"ABA"`, prefix `"A"` equals suffix `"A"`, so $\pi[2] = 1$.
- For `"ABAB"`, prefix `"AB"` equals suffix `"AB"`, so $\pi[3] = 2$.
- For `"ABABC"`, no proper prefix matches a suffix, so $\pi[4] = 0$.

Computing $\pi$ takes $O(m)$ time and $O(m)$ space using dynamic programming. Instead of scanning from scratch for each position $i$, we reuse the previously computed prefix length $j = \pi[i-1]$. If $P[i] == P[j]$, then $\pi[i] = j + 1$. If they mismatch, we fall back to $j = \pi[j-1]$ iteratively until a match is found or $j$ reaches 0.

## See it

Linear-time calculation of the prefix array pi:

```python
def compute_pi(pattern: str) -> list[int]:
    m = len(pattern)
    pi = [0] * m
    j = 0  # length of previous longest prefix suffix
    for i in range(1, m):
        while j > 0 and pattern[i] != pattern[j]:
            j = pi[j - 1]
        if pattern[i] == pattern[j]:
            j += 1
        pi[i] = j
    return pi

# Pattern: "ABABCABAB"
# pi:      [0, 0, 1, 2, 0, 1, 2, 3, 4]
print(compute_pi("ABABCABAB"))
```

## Go deeper

Why does the while loop `j = pi[j - 1]` run in amortized $O(m)$ time?

Notice that $j$ starts at 0 and can increase by at most 1 in each iteration of the outer for loop (when `pattern[i] == pattern[j]`). Thus, over all $m$ steps, $j$ can increase at most $m$ times.

Inside the while loop, each execution strictly decreases $j$ because $\pi[j - 1] < j$. Since $j$ is non-negative and increases at most $m$ times total, it can decrease at most $m$ times across the entire function. Therefore, the inner while loop executes at most $m$ times across all iterations combined, proving total linear time $O(m)$.

| Pattern Index `i` | Substring `P[0..i]` | Longest Prefix-Suffix | $\pi[i]$ Value |
|:---:|:---:|:---:|:---:|
| 0 | `"A"` | `""` | 0 |
| 1 | `"AB"` | `""` | 0 |
| 2 | `"ABA"` | `"A"` | 1 |
| 3 | `"ABAB"` | `"AB"` | 2 |
| 4 | `"ABABC"` | `""` | 0 |

## Watch out

- Confusing proper prefixes with general substrings: the entire string cannot be a proper prefix of itself.
- Resetting j = 0 on mismatch instead of j = pi[j - 1], losing partial prefix matches.
- Off-by-one indexing when accessing pi[j - 1] when j = 0.

## Remember

- pi[i] records the length of the longest proper prefix of P[0..i] that is also a suffix.
- Computing pi takes strictly O(m) time through amortized analysis on prefix pointer j.
- On mismatch during construction, j falls back to pi[j - 1] without restarting from scratch.
