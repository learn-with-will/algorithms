---
id: lesson-06
slug: hash-tables
title: "Hash Tables"
level: beginner
order: 6
duration: 28
tags:
  - hash-table
  - hashing
  - collisions
  - dict
  - load-factor
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain how a **hash function** maps keys to buckets for `O(1)`-average lookup.
- Describe the two collision-resolution strategies: **chaining** and **open addressing**.
- Define the **load factor** and explain why resizing keeps operations fast.
- State why hash-table operations are `O(1)` *average* but `O(n)` *worst* case.
- Use Python's `dict` and `set` correctly, including the hashable-key requirement.

# Why This Concept Exists

Searching an unsorted array for a key is `O(n)`; even a sorted array needs `O(log n)`.
For the extremely common task of "store key–value pairs and look them up by key", we
want something faster. A **hash table** delivers `O(1)` average-time insert, lookup, and
delete by turning a key directly into an array index — no scanning, no comparisons down a
tree. It is the structure behind Python's `dict` and `set`, database indexes, caches, and
symbol tables in compilers. The price is that the `O(1)` is an *average*, not a
guarantee, and that keys must be hashable.

# Concept Explanation

### The idea: keys to indices

A hash table stores entries in an array of `m` slots called **buckets**. A **hash
function** `h(key)` turns a key into an integer, and `h(key) mod m` selects a bucket. If
the hash spreads keys evenly, each bucket holds only a handful of entries, so we go
almost straight to the right slot.

```text
h("cat") mod 8 = 3        buckets:  0 1 2 3 4 5 6 7
h("dog") mod 8 = 6                          |     |
                                          "cat" "dog"
```

A good hash function is **deterministic** (same key → same value), **fast**, and
**uniform** (spreads keys evenly to avoid pile-ups).

### Collisions

Because there are more possible keys than buckets, two keys can map to the same bucket —
a **collision**. Every hash table needs a strategy to resolve them:

- **Chaining.** Each bucket holds a small list of all entries that hashed there. Lookup
  hashes to the bucket, then scans its short list. If the load factor is bounded, the
  lists stay short and lookup is `O(1)` average.
- **Open addressing.** All entries live in the bucket array itself. On a collision, you
  **probe** for another open slot by a fixed rule — linear probing (`+1, +2, …`),
  quadratic probing, or double hashing. Here the array must have empty slots, so the load
  factor must stay below 1.

### Load factor and resizing

The **load factor** is `α = n / m`: the number of stored entries divided by the number of
buckets. As `α` rises, collisions become frequent and operations slow down. Hash tables
keep `α` below a threshold (Python's `dict` resizes to stay roughly two-thirds full) by
**resizing**: allocate a larger bucket array and **rehash** every entry into it. A resize
is `O(n)`, but like a dynamic array it happens geometrically rarely, so insertion stays
`O(1)` **amortized**.

### Why average, not worst

If the hash spreads keys well and `α` is bounded, the expected work per operation is
`O(1)`. But in the worst case — every key colliding into one bucket, or an adversary
choosing keys to collide — a lookup degrades to scanning `n` entries, `O(n)`. Good hash
functions and resizing make the worst case rare in practice, but it is real.

### Python's dict and set

Python's `dict` and `set` are hash tables. Average `O(1)` membership, insert, and delete.
Keys must be **hashable** — essentially immutable, with a stable `__hash__` — so you can
use `str`, `int`, `float`, and `tuple` as keys, but not `list` or `dict`. Since Python
3.7, `dict` also preserves insertion order as a language guarantee (an ordering feature
layered on top of the hash table, not a change to its `O(1)` behaviour).

# Key Terminology

- **Hash function** — maps a key to an integer bucket index; deterministic, fast, uniform.
- **Bucket / slot** — a position in the underlying array.
- **Collision** — two keys mapping to the same bucket.
- **Chaining / open addressing** — store collisions in a per-bucket list / probe for another slot.
- **Load factor (α = n/m)** — fullness ratio that governs performance.
- **Rehash** — recompute buckets for all entries when resizing.

# Complexity

| Operation | Average | Worst | Notes |
| --------- | ------- | ----- | ----- |
| Insert | O(1) | O(n) | amortized over resizes |
| Lookup / search | O(1) | O(n) | worst = all keys collide |
| Delete | O(1) | O(n) | |

Space is `O(n)` for the entries plus `O(m)` for the buckets, with `m` kept proportional
to `n` so the total is `O(n)`.

# Implementation in Python

A minimal hash map using **chaining**, to show the mechanism (in practice, just use `dict`):

```python
class HashMap:
    def __init__(self, num_buckets: int = 8) -> None:
        self._buckets: list[list[tuple]] = [[] for _ in range(num_buckets)]

    def _index(self, key) -> int:
        return hash(key) % len(self._buckets)      # Python's built-in hash()

    def put(self, key, value) -> None:
        bucket = self._buckets[self._index(key)]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)           # update existing key
                return
        bucket.append((key, value))                # new key

    def get(self, key):
        bucket = self._buckets[self._index(key)]
        for k, v in bucket:                        # scan the short chain
            if k == key:
                return v
        raise KeyError(key)
```

# Real World Analogy

A hash table is a **coat-check that shelves by a rule instead of arrival order**. The
attendant computes a shelf number from your ticket ("ticket 8421 → shelf 1") and puts
your coat there, so retrieval is one direct trip — not a walk down every shelf. If two
tickets map to the same shelf (a collision), that shelf holds a small pile you glance
through. Keep the shelves from getting overloaded (bounded load factor) and every trip
stays quick.

# Examples

## Example 1 — Basic: O(1) membership with a set

```python
def has_duplicates(a: list[int]) -> bool:
    seen: set[int] = set()
    for x in a:
        if x in seen:        # O(1) average membership test
            return True
        seen.add(x)          # O(1) average insert
    return False
```

**Why this is good:** a `set` turns an `O(n²)` all-pairs comparison into an `O(n)` scan.
Each membership test and insert is `O(1)` average — the everyday reason to reach for a
hash-based container.

## Example 2 — Real-world: counting word frequencies

```python
from collections import defaultdict

def word_counts(words: list[str]) -> dict[str, int]:
    counts: dict[str, int] = defaultdict(int)
    for w in words:
        counts[w] += 1       # hash to the key's bucket, O(1) average
    return dict(counts)
```

**Why this is good:** the `dict` maps each distinct word straight to its running count in
`O(1)` average, so tallying `n` words is `O(n)` total — far better than sorting or
scanning for each word.

## Example 3 — Best practice / edge case: hashable keys only

```python
point = (3, 4)
seen = {point}          # OK: tuples are immutable and hashable

try:
    bad = {[3, 4]}      # TypeError: unhashable type: 'list'
except TypeError as e:
    print(e)
```

**Why this is good:** it surfaces the rule that trips people up — mutable objects like
`list` cannot be keys, because a key that could change would land in the wrong bucket.
Use immutable keys (`str`, `int`, `tuple`); convert a `list` to a `tuple` first if needed.

# Common Mistakes

- **Expecting worst-case `O(1)`.** Hash operations are `O(1)` *average*; a bad hash or
  adversarial keys can make them `O(n)`.
- **Using a mutable object as a key.** `list`/`dict` are unhashable; mutating a key after
  insertion corrupts lookups. Use immutable keys.
- **Relying on iteration order for correctness.** `dict` preserves insertion order, but
  `set` iteration order is unspecified — never depend on it.
- **Building your own hash table by default.** In Python, `dict`/`set` are the answer;
  hand-rolled tables are for learning the mechanism, not for production.

# Best Practices

- Use `set` for membership and de-duplication, `dict` for key→value mapping.
- Reach for `collections.Counter` and `defaultdict` for counting and grouping.
- Keep keys immutable and hashable; convert `list`→`tuple` when you need a composite key.
- Trust the language to resize and rehash — do not micro-manage bucket counts.

# Summary

- A hash table maps keys to buckets via a hash function for `O(1)`-average operations.
- Collisions are resolved by **chaining** (per-bucket lists) or **open addressing** (probing).
- The **load factor** `α = n/m` governs speed; resizing/rehashing keeps it bounded.
- Operations are `O(1)` average but `O(n)` worst case.
- Python's `dict` and `set` are hash tables; keys must be hashable (immutable).

# Flash Cards

Q: How does a hash table achieve O(1)-average lookup?
A: A hash function maps the key straight to a bucket index, so you go almost directly to the entry instead of scanning.

Q: What are the two main collision-resolution strategies?
A: Chaining (each bucket holds a list of colliding entries) and open addressing (probe for another open slot).

Q: What is the load factor, and why does it matter?
A: α = n/m (entries ÷ buckets); as it rises collisions increase, so tables resize to keep it bounded and operations O(1) average.

Q: Why are hash-table operations O(1) average but O(n) worst case?
A: With a good hash and bounded load factor each bucket is tiny (average O(1)); if all keys collide into one bucket you scan them all (O(n)).

Q: Why can't a Python list be a dict key?
A: Lists are mutable and therefore unhashable; a key that could change would no longer map to the bucket it was stored in.

Q: Since Python 3.7, what ordering guarantee does dict provide?
A: It preserves insertion order — an ordering feature on top of the hash table, not a change to its O(1) average behaviour.

# Exercises

### Easy
Use a `dict` to write `first_unique(s)` that returns the first character in a string that
appears exactly once, or `None`. What is its time complexity?

### Medium
Solve "two-sum": given a list and a target, return indices of two numbers that add to the
target, in `O(n)` using a `dict`. Explain how the dict replaces the inner loop.

### Challenging
Extend the `HashMap` class with a `delete(key)` method and automatic resizing: when the
load factor exceeds `0.75`, double the bucket count and rehash all entries. Explain why
this keeps insertion `O(1)` amortized.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 11
  ("Hash Tables"): hash functions, chaining, open addressing.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 3.4 ("Hash Tables").
- Python — [TimeComplexity wiki](https://wiki.python.org/moin/TimeComplexity) (`dict`/`set`)
  and the [`__hash__` docs](https://docs.python.org/3/reference/datamodel.html#object.__hash__).
