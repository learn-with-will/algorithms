---
id: lesson-24
slug: string-matching
title: "String Matching: Naive and KMP"
level: advanced
order: 24
duration: 30
tags:
  - string-matching
  - kmp
  - prefix-function
  - rabin-karp
  - pattern-matching
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the string-matching problem and the naive algorithm's `O(nm)` cost.
- Define the **prefix (failure) function** of a pattern.
- Explain how **KMP** achieves `O(n + m)` by never re-examining text characters.
- Implement the prefix function and KMP search.
- Describe **Rabin-Karp**'s rolling hash and when it shines.

# Why This Concept Exists

Finding a pattern inside a text — `Ctrl-F`, `grep`, matching a DNA motif in a genome, scanning
logs for a signature — is one of the most common operations there is. The obvious approach
(try the pattern at every position) can be quadratic, and on large texts that is far too slow.
**Knuth–Morris–Pratt (KMP)** was the first algorithm to match in guaranteed **linear** time by
never backing up in the text: when a mismatch occurs, it uses precomputed knowledge of the
pattern's own structure to resume without re-checking characters. It is a beautiful example of
preprocessing one input to speed up the search.

# Concept Explanation

### The problem and the naive algorithm

Given a **text** `T` of length `n` and a **pattern** `P` of length `m`, find all positions
where `P` occurs in `T`. The **naive** algorithm tries every one of the `n − m + 1` alignments
and compares up to `m` characters each, so its worst case is `O((n − m + 1)·m) = O(nm)`. The
bad case is highly repetitive input, e.g. finding `"aaab"` in `"aaaaaaaaab"`: each alignment
re-compares the same `a`s.

### The insight: don't throw away what you learned

When the naive algorithm mismatches after matching a few characters, it slides the pattern
forward by **one** and re-compares from scratch — wasting the fact that it already knows those
characters. KMP fixes this by precomputing, for the pattern alone, how far it can safely slide
on a mismatch without missing a possible match.

### The prefix (failure) function

The **prefix function** `π` of a pattern records, for each prefix `P[0..i]`, the length of the
**longest proper prefix that is also a suffix** of that prefix. ("Proper" means not the whole
string.) It captures the pattern's internal repetition:

```text
P = "a b a b a c"
π = [0,0,1,2,3,0]
      π[4]=3 because "aba" is both a prefix and a suffix of "ababa"
```

On a mismatch after matching `k` characters, KMP does not restart — it falls back to `π[k−1]`,
the next-longest prefix that might still match, and continues. Computing `π` takes `O(m)`.

### KMP search

KMP scans the text left to right with a pattern pointer `k`. On a mismatch it sets
`k = π[k−1]` (never moving the **text** pointer backward); on a match it advances both. Because
the text pointer only ever moves forward and the pattern fallback is amortized `O(1)`, the whole
search is `O(n)`, plus `O(m)` to build `π` — total **`O(n + m)`**.

### Rabin-Karp: hashing instead of comparing

**Rabin-Karp** compares a **rolling hash** of each text window with the pattern's hash,
verifying character-by-character only on a hash match. The rolling hash updates in `O(1)` as the
window slides, so the average time is `O(n + m)`; the worst case (many hash collisions) is
`O(nm)`. Its strength is matching **many patterns at once** (hash them all) and multi-dimensional
matching.

# Key Terminology

- **Text / pattern** — the string searched (`n`) / the string sought (`m`).
- **Naive matching** — try every alignment, `O(nm)`.
- **Prefix (failure) function** — longest proper prefix that is also a suffix, per prefix.
- **KMP** — linear-time matcher that never re-reads text characters.
- **Rolling hash** — a hash updated in `O(1)` as a window slides (Rabin-Karp).

# Complexity

| Algorithm | Preprocessing | Search | Worst case |
| --------- | ------------- | ------ | ---------- |
| Naive | none | — | O(nm) |
| KMP | O(m) prefix function | O(n) | O(n + m) |
| Rabin-Karp | O(m) | O(n) average | O(nm) worst (collisions) |

# Implementation in Python

```python
def prefix_function(p: str) -> list[int]:
    pi = [0] * len(p)
    k = 0                                   # length of current longest prefix-suffix
    for i in range(1, len(p)):
        while k > 0 and p[i] != p[k]:
            k = pi[k - 1]                   # fall back within the pattern
        if p[i] == p[k]:
            k += 1
        pi[i] = k
    return pi


def kmp_search(text: str, pattern: str) -> list[int]:
    """Return every start index where pattern occurs in text."""
    if not pattern:
        return list(range(len(text) + 1))
    pi = prefix_function(pattern)
    matches, k = [], 0
    for i in range(len(text)):              # text pointer i never moves backward
        while k > 0 and text[i] != pattern[k]:
            k = pi[k - 1]
        if text[i] == pattern[k]:
            k += 1
        if k == len(pattern):               # full match
            matches.append(i - len(pattern) + 1)
            k = pi[k - 1]                    # keep searching for overlaps
    return matches


def naive_search(text: str, pattern: str) -> list[int]:
    m = len(pattern)
    return [i for i in range(len(text) - m + 1) if text[i:i + m] == pattern]
```

# Real World Analogy

KMP is like a **detective who never re-questions a witness**. The naive searcher, on hitting a
contradiction, starts the whole interview over from the next person. The KMP detective has
already studied the pattern of the story and knows exactly how far back the account can still be
consistent — so on a contradiction they jump straight to that point and carry on, never
re-asking what they already know. That "never go back over the text" discipline is what buys
linear time.

# Examples

## Example 1 — Basic: naive search and its bad case

```python
naive_search("abxabxabc", "abc")   # [6]
# Worst case: naive_search("aaaaaa", "aaab") re-compares the a's at every shift -> O(nm)
```

**Why this is good:** it shows both the simplicity of naive matching and exactly when it is
slow — repetitive text where each alignment re-checks the same characters. That waste is what
KMP eliminates.

## Example 2 — Real-world: KMP finds all occurrences in linear time

```python
kmp_search("ababcababcab", "ababc")   # [0, 5]
prefix_function("ababc")               # [0, 0, 1, 2, 0]
```

**Why this is good:** the prefix function `[0,0,1,2,0]` encodes that after matching `abab` a
mismatch can fall back to the length-2 prefix `ab` rather than restart — so the text is scanned
once, `O(n + m)`. It also finds overlapping matches cleanly by falling back after each hit.

## Example 3 — Best practice / edge case: choosing the right matcher

```text
Single pattern, guaranteed linear time      -> KMP  (O(n + m), no bad inputs)
Many patterns searched at once / plagiarism -> Rabin-Karp (hash them all)
Short text or one-off search                -> naive / built-in `in` is fine
```

**Why this is good:** it frames the trade-offs. In everyday Python you would just use `in` or
`str.find` (which are well optimized), but knowing KMP's guarantee and Rabin-Karp's multi-
pattern strength lets you choose deliberately when performance or scale demands it.

# Common Mistakes

- **Moving the text pointer backward in KMP.** The whole point is that it never does; only the
  pattern pointer falls back via `π`.
- **Off-by-one in the prefix function.** Fall back with `k = pi[k-1]` (not `pi[k]`), and index
  the pattern carefully.
- **Misdefining the prefix function.** It is the longest *proper* prefix that is also a suffix —
  "proper" excludes the whole prefix itself.
- **Assuming Rabin-Karp is always linear.** Its worst case is `O(nm)` when hashes collide often;
  a good hash makes that rare but not impossible.

# Best Practices

- Reach for **KMP** when you need a guaranteed linear-time single-pattern search.
- Use **Rabin-Karp** when searching for **many** patterns at once or in 2-D matching.
- For ordinary tasks, use Python's built-in `in` / `str.find` — they are fast and correct.
- Precompute the pattern's prefix function once if you search the same pattern in many texts.

# Summary

- Naive matching tries every alignment and is `O(nm)` in the worst case.
- The **prefix function** captures a pattern's internal repetition in `O(m)`.
- **KMP** uses it to search in `O(n + m)`, never re-examining a text character.
- **Rabin-Karp** uses a rolling hash — `O(n + m)` average, `O(nm)` worst — and excels at
  multi-pattern search.
- In practice, use the language's built-in search unless you specifically need these guarantees.

# Flash Cards

Q: What is the worst-case time of the naive string-matching algorithm?
A: O(nm) — it tries n − m + 1 alignments and compares up to m characters at each.

Q: What does the prefix (failure) function of a pattern store?
A: For each prefix, the length of the longest proper prefix of it that is also a suffix — capturing the pattern's internal repetition.

Q: What is KMP's total running time, and why is it linear?
A: O(n + m); the text pointer never moves backward and pattern fallbacks are amortized O(1), so the text is scanned once after O(m) preprocessing.

Q: In KMP, what happens to the text pointer on a mismatch?
A: Nothing — it never moves backward; only the pattern pointer falls back via the prefix function.

Q: How does Rabin-Karp match, and what is its complexity?
A: It compares a rolling hash of each text window with the pattern's hash (verifying on a hash match); O(n + m) average, O(nm) worst case with many collisions.

Q: When is Rabin-Karp preferable to KMP?
A: When searching for many patterns simultaneously (hash them all) or in multi-dimensional matching.

# Exercises

### Easy
Compute the prefix function of `"aabaaab"` by hand and check it against `prefix_function`.

### Medium
Explain, step by step, how `kmp_search` finds both matches of `"aba"` in `"ababa"` without ever
moving the text pointer backward. Where does the prefix-function fallback occur?

### Challenging
Implement Rabin-Karp with a rolling polynomial hash and explain how the hash of the window
`T[i+1 .. i+m]` is computed from the hash of `T[i .. i+m-1]` in `O(1)`. What causes its worst-
case `O(nm)` behaviour, and how does verifying on a hash match keep it correct despite collisions?

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 32
  ("String Matching"): the naive algorithm, Rabin-Karp, and KMP with the prefix function.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 5.3 ("Substring Search": KMP, Boyer-Moore,
  Rabin-Karp).
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Section 6.6 (string matching).
