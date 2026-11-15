---
slug: naive-string-matching-scan
title: "Naive String Matching Scan"
topic: string-matching
kind: concept
summary: "Slide the pattern along the text one position at a time and compare characters until a mismatch occurs."
tags: ["algorithms", "strings", "brute-force", "pattern-matching"]
related: ["kmp-prefix-function-pi-array", "rabin-karp-rolling-hash", "string-matching-algorithm-selection"]
---
> **In one line:** Naive string matching slides the pattern one shift at a time, testing all possible alignments against the text.

## The idea

The naive string matching algorithm tests every possible alignment of a pattern of length $m$ across a text of length $n$. For each alignment shift $s$ from $0$ to $n - m$, the algorithm checks whether `text[s + j] == pattern[j]` for all $0 \le j < m$. When a mismatch is encountered, the comparison loop breaks immediately, and the pattern slides forward by exactly one position ($s + 1$).

This brute-force approach requires no precomputation or extra memory ($O(1)$ space). On typical natural-language text with large alphabets, mismatches occur almost immediately on the first or second character, yielding average-case time close to $O(n + m)$. 

However, in the worst case—such as searching for pattern `"aaab"` inside text `"aaaaaaaaaaaaaaaaab"`—every shift matches $m - 1$ characters before failing, causing total time complexity of $O((n - m + 1) \times m) = O(n \times m)$.

Understanding the naive approach highlights the redundant work it performs: after finding that several characters match, sliding by one discards all knowledge gained during the scan, re-examining characters that were already inspected.

## See it

Iterative sliding window implementation of naive string matching:

```python
def naive_search(text: str, pattern: str) -> list[int]:
    n, m = len(text), len(pattern)
    matches = []
    for s in range(n - m + 1):
        match = True
        for j in range(m):
            if text[s + j] != pattern[j]:
                match = False
                break
        if match:
            matches.append(s)
    return matches

text = "ABABDABACDABABCABAB"
pattern = "ABABCABAB"
print(naive_search(text, pattern))  # Output: [10]
```

## Go deeper

The fundamental vulnerability of naive search is repeated backtracking in the text. When a mismatch occurs after matching $k$ characters, the text index effectively rewinds back to $s + 1$. 

In streaming scenarios where characters arrive over a network socket or cannot be buffered in memory, naive matching is unsuitable because rewinding the input stream requires keeping an unbounded history buffer.

Modern algorithms eliminate this backtracking. The Knuth-Morris-Pratt (KMP) algorithm precomputes patterns to shift intelligently without moving backward in the text, while Boyer-Moore skips multiple characters at once by comparing patterns from right to left.

> **Note:** Naive search is frequently used as the baseline implementation in standard libraries for small strings (e.g. $m \le 4$) because its simplicity has near-zero overhead and fits entirely inside CPU instruction caches.

## Watch out

- Forgetting the loop boundary n - m + 1: stopping at n - m misses matches at the very end of the text.
- Re-scanning characters when patterns have periodic structures, leading to worst-case O(n * m) runtimes.
- Allocating text slices like text[s:s+m] == pattern inside the loop, which copies m characters per iteration in Python.

## Remember

- Naive string matching slides the pattern one shift at a time without precomputation.
- Worst-case runtime is O(n * m) due to repeated backtracking after near-matches.
- Average-case runtime on natural text is near-linear O(n + m) due to early character mismatches.
