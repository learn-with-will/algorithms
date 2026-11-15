---
slug: kmp-search-linear-time-matching
title: "KMP Search Linear-Time Matching"
topic: string-matching
kind: concept
summary: "Search text in O(n) time without backtracking the text index by leveraging the precomputed prefix table."
tags: ["algorithms", "strings", "kmp", "linear-time", "search"]
related: ["kmp-prefix-function-pi-array", "naive-string-matching-scan", "rabin-karp-rolling-hash"]
---
> **In one line:** KMP searches text in deterministic O(n) time without ever rewinding the text pointer.

## The idea

Using the precomputed prefix table $\pi$, Knuth-Morris-Pratt searches a text $T$ of length $n$ in deterministic $O(n)$ time. The text pointer $i$ moves strictly from $0$ to $n-1$, never moving backward.

A pattern pointer $j$ tracks how many characters of pattern $P$ currently match the text ending at $T[i]$:
1. When $T[i] == P[j]$, both pointers advance ($j$ increments by 1).
2. If $j == m$, a full match is detected at index $i - m + 1$. The next comparison sets $j = \pi[j - 1]$ to look for subsequent overlapping occurrences.
3. When $T[i] \neq P[j]$ and $j > 0$, the text pointer $i$ stays frozen while $j$ falls back to $\pi[j - 1]$. The algorithm knows that the first $\pi[j-1]$ characters of the pattern already match the text characters right before $T[i]$.
4. If $j == 0$ and mismatch persists, $i$ advances to the next text character.

Because the text pointer never retreats, KMP guarantees $O(n + m)$ total runtime regardless of input repetitive patterns.

## See it

KMP search execution without text rewinding:

```python
def kmp_search(text: str, pattern: str) -> list[int]:
    if not pattern:
        return []
    pi = compute_pi(pattern)
    n, m = len(text), len(pattern)
    matches = []
    j = 0  # pattern pointer
    
    for i in range(n):
        while j > 0 and text[i] != pattern[j]:
            j = pi[j - 1]
        if text[i] == pattern[j]:
            j += 1
        if j == m:
            matches.append(i - m + 1)
            j = pi[j - 1]
    return matches

text = "AABAACAADAABAABA"
pat = "AABA"
print(kmp_search(text, pat))  # Output: [0, 9, 12]
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

The guarantee that text pointer $i$ never retreats makes KMP ideal for streaming data. In hardware protocol analyzers, intrusion detection systems, and unbuffered pipe processing, input characters arrive sequentially. Because KMP only maintains state via the integer variable $j$, it operates seamlessly as a deterministic finite automaton (DFA).

Every state in this DFA represents the length of the matched prefix. The transition on mismatch is governed precisely by the $\pi$ table:

```text
State 0 --'A'--> State 1 --'B'--> State 2 --'A'--> State 3
   ^               |                |
   |---mismatch----+--mismatch------+
```

Amortized analysis mirrors the prefix computation: $j$ increments at most $n$ times and decrements at most $n$ times. Therefore, the inner while loop across all $n$ text steps takes $O(n)$ operations, giving total search time $O(n)$ after $O(m)$ preprocessing.

## Watch out

- Resetting j to 0 after finding a match instead of pi[m - 1], which misses overlapping matches (e.g. searching 'ABA' in 'ABABA').
- Decrementing text pointer i on mismatch: i must never decrement in KMP.
- Failing to handle an empty pattern edge case.

## Remember

- KMP achieves O(n + m) total runtime by never rewinding the text pointer.
- On mismatch, pattern pointer j falls back to pi[j - 1], preserving matched prefix information.
- Overlapping matches are found seamlessly by resetting j to pi[m - 1] upon full match.
