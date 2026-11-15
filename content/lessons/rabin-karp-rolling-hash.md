---
slug: rabin-karp-rolling-hash
title: "Rabin-Karp Rolling Hash"
topic: string-matching
kind: concept
summary: "Match strings using polynomial rolling hash updates in O(1) time per window shift."
tags: ["algorithms", "strings", "hashing", "rabin-karp", "rolling-hash"]
related: ["naive-string-matching-scan", "kmp-search-linear-time-matching", "string-matching-algorithm-selection"]
---
> **In one line:** Rabin-Karp filters candidate match positions in O(1) time per shift using an algebraic rolling hash.

## The idea

The Rabin-Karp algorithm uses hashing to locate pattern matches in text. Instead of checking characters at each alignment, it computes a hash value for the pattern and for each sliding window of length $m$ across text $T$.

If a window's hash does not match the pattern's hash, that window cannot match the pattern. If the hashes match, a potential match is found; we then perform a full character-by-character comparison to confirm the match and rule out **hash collisions** (spurious hits).

To make window evaluation efficient, Rabin-Karp uses a **polynomial rolling hash**. Shifting the window from $T[s \dots s+m-1]$ to $T[s+1 \dots s+m]$ takes $O(1)$ time by removing the outgoing character's high-order contribution, multiplying by the base $B$, adding the incoming character, and reducing modulo a large prime $M$:

$$H_{new} = ((H_{old} - T[s] \cdot B^{m-1}) \cdot B + T[s+m]) \pmod M$$

With a sufficiently large prime $M$, collisions are rare, giving average-case runtime $O(n + m)$.

## See it

Rolling hash string search with collision verification:

```python
def rabin_karp(text: str, pattern: str, base: int = 256, mod: int = 10**9 + 7) -> list[int]:
    n, m = len(text), len(pattern)
    if m > n or m == 0:
        return []
    
    h = pow(base, m - 1, mod)
    p_hash, t_hash = 0, 0
    for i in range(m):
        p_hash = (base * p_hash + ord(pattern[i])) % mod
        t_hash = (base * t_hash + ord(text[i])) % mod
    
    matches = []
    for s in range(n - m + 1):
        if p_hash == t_hash:
            if text[s:s + m] == pattern:  # verify against hash collision
                matches.append(s)
        if s < n - m:
            t_hash = ((t_hash - ord(text[s]) * h) * base + ord(text[s + m])) % mod
    return matches

print(rabin_karp("GEEKS FOR GEEKS", "GEEK"))  # Output: [0, 10]
```

## Go deeper

The major advantage of Rabin-Karp over KMP is its generalization to **multi-pattern search** and **2D pattern matching**.

When searching for $k$ patterns of equal length $m$, store all pattern hashes in a hash set. For each text window, look up the rolling hash in the set in $O(1)$ expected time. This allows checking $k$ patterns simultaneously in $O(n + k \cdot m)$ average time, compared to $O(k \cdot n)$ for running KMP $k$ times.

> **Tip:** In Python, avoid negative numbers inside modulo arithmetic. When computing `t_hash - ord(text[s]) * h`, the result can be negative. In Python `(-5) % 7 == 2` works correctly, but in C/C++/Java `%` is remainder, requiring `((diff % mod) + mod) % mod`.

Worst-case behavior occurs when a malicious input generates hash collisions at every single shift, forcing full string checks and degrading to $O(n \times m)$. Using randomized prime moduli mitigates algorithmic complexity attacks.

## Watch out

- Forgetting character confirmation when hashes match: collisions do happen and will cause false positives without verification.
- Modular arithmetic bugs when rolling hash values become negative in languages with truncated division.
- Exponent overflow when calculating B^(m-1): always compute using modular exponentiation pow(base, m - 1, mod).

## Remember

- Rabin-Karp slides an O(1) rolling hash across the text to filter candidate match positions.
- Matches must always be verified with full character comparisons to eliminate hash collisions.
- Excels at multi-pattern search of fixed length by storing pattern hashes in a hash table.
