---
id: lesson-03
slug: arrays-and-dynamic-arrays
title: "Arrays and Dynamic Arrays"
level: beginner
order: 3
duration: 24
tags:
  - arrays
  - dynamic-array
  - amortized
  - list
  - data-structures
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain why a contiguous array gives `O(1)` random access by index.
- Describe how a **dynamic array** grows and why append is `O(1)` **amortized**.
- Give the cost of the core `list` operations, including the `O(n)` ones.
- Recognize when front-insertion turns an innocent loop into `O(n²)`.
- Explain what Python's `list` really is under the hood.

# Why This Concept Exists

The array is the most fundamental data structure — a block of equal-sized slots laid
out one after another in memory. That simple layout is what makes indexing instant, and
it is the substrate almost every other structure is built on. But a raw array has a
fixed size, and real programs rarely know how many elements they will hold. The
**dynamic array** solves that: it presents an array that grows on demand, while
preserving fast indexing and keeping the cost of growth negligible on average. Python's
`list` is a dynamic array, so understanding it explains the performance of code you
write every day.

# Concept Explanation

### The array and O(1) indexing

An **array** stores `n` elements in a single contiguous block of memory. If the block
starts at address `base` and each element occupies `w` bytes, then element `i` lives at
`base + i·w`. The computer can compute that address with one multiply and one add —
independent of `i` and of `n`. That is why reading or writing `a[i]` is `O(1)`: no
searching, just arithmetic.

```text
index:    0     1     2     3     4
        +-----+-----+-----+-----+-----+
        |  7  |  3  |  9  |  1  |  5  |
        +-----+-----+-----+-----+-----+
address: base  +w    +2w   +3w   +4w
```

### The problem: fixed size

A static array must be given its capacity up front. If it fills up, you cannot simply
extend it — the memory right after it may be in use. The only option is to allocate a
larger block and copy everything over, which is `O(n)`. Doing that on *every* insertion
would make building a list of `n` items cost `O(n²)`.

### Dynamic arrays and geometric growth

A **dynamic array** keeps two numbers: the **size** (how many elements are stored) and
the **capacity** (how many the current block can hold). Appending when `size < capacity`
just writes into the next slot — `O(1)`. When the block is full, the dynamic array:

1. allocates a new block whose capacity is a **constant factor larger** (e.g. double),
2. copies the existing elements over, and
3. stores the new element.

The trick is the constant factor. Because the capacity grows *geometrically*, resizes
happen exponentially less often as the list gets bigger, and the total copying work
across `n` appends is bounded by a constant times `n`.

### Why append is O(1) amortized

Consider `n` appends into an array that doubles when full, starting from capacity 1.
Resizes happen at sizes 1, 2, 4, 8, …, up to `n`, copying that many elements each time.
The total copying work is:

```text
1 + 2 + 4 + 8 + ... + n  <  2n        (a geometric series)
```

So `n` appends do at most about `2n` element-moves *in total* — an average (amortized)
of `O(1)` per append, even though the individual resize operations are `O(n)`. Any
growth factor greater than 1 gives this guarantee. (CPython grows its `list` by roughly
an eighth each time rather than doubling, but the geometric-growth argument is the same.)

### What a Python list actually is

A Python `list` is a dynamic array of **references** to objects — *not* a linked list.
That is why `a[i]` is `O(1)` and why `list` is the right default sequence. Appending and
popping at the **end** are `O(1)` (amortized for append). Inserting or deleting at the
**front or middle** must shift every following element, so it is `O(n)`.

# Key Terminology

- **Array** — a contiguous, fixed-size block of equal-sized slots.
- **Random access** — reaching any element in `O(1)` via its index.
- **Dynamic array** — an auto-growing array (Python's `list`).
- **Size vs. capacity** — elements stored vs. slots currently allocated.
- **Geometric growth** — enlarging capacity by a constant factor, giving amortized-O(1) append.

# Complexity

For a dynamic array / Python `list` of `n` elements:

| Operation | Time | Notes |
| --------- | ---- | ----- |
| Index read/write `a[i]` | O(1) | address arithmetic |
| Append `a.append(x)` | O(1) amortized | occasional `O(n)` resize |
| Pop from end `a.pop()` | O(1) | |
| Insert at front/middle `a.insert(i, x)` | O(n) | shifts later elements |
| Pop from front/middle `a.pop(0)` | O(n) | shifts later elements |
| Search `x in a` | O(n) | linear scan |
| Length `len(a)` | O(1) | stored, not counted |
| Slice `a[i:j]` | O(k) | k = j − i elements copied |

Total space is `O(n)` (with a small constant of over-allocated slack).

# Implementation in Python

A minimal dynamic array built on a fixed-size backing store, to show the growth logic:

```python
class DynamicArray:
    def __init__(self) -> None:
        self._capacity = 1
        self._size = 0
        self._data = [None] * self._capacity   # the backing block

    def __len__(self) -> int:
        return self._size

    def __getitem__(self, i: int):
        if not 0 <= i < self._size:
            raise IndexError(i)
        return self._data[i]                    # O(1) address arithmetic

    def append(self, value) -> None:
        if self._size == self._capacity:        # full: grow geometrically
            self._resize(2 * self._capacity)
        self._data[self._size] = value          # O(1) common case
        self._size += 1

    def _resize(self, new_capacity: int) -> None:
        bigger = [None] * new_capacity          # O(n) — happens rarely
        for i in range(self._size):
            bigger[i] = self._data[i]
        self._data = bigger
        self._capacity = new_capacity
```

# Real World Analogy

A dynamic array is a **numbered coat-check rack**. Every coat has a numbered hook, so
staff fetch coat #57 instantly without scanning the row — that is `O(1)` indexing. When
the rack fills, they wheel in a rack twice as big and move the coats across once. It is
a hassle in the moment, but because they double the size, they do it rarely — so the
*average* effort per coat stays tiny.

# Examples

## Example 1 — Basic: indexing is constant regardless of position

```python
a = [10, 20, 30, 40, 50]
a[0]     # 10  -- same cost...
a[4]     # 50  -- ...as reaching the last element
a[2] = 99  # O(1) write
```

**Why this is good:** it shows the defining property of an array — position does not
affect access cost. Reaching the last element is no more expensive than the first.

## Example 2 — Real-world: building a list, the fast way

```python
# O(n) overall: each append is O(1) amortized
squares = []
for i in range(1_000_000):
    squares.append(i * i)
```

**Why this is good:** a million appends cost `O(n)` in total thanks to amortized-`O(1)`
append, not `O(n²)`. This is the everyday pattern that makes `list` a good default —
and it is why you should append to the end rather than insert at the front.

## Example 3 — Best practice / edge case: never build by front-insertion

```python
# BAD: insert(0, ...) shifts everything each time -> O(n²) total
out = []
for x in data:
    out.insert(0, x)          # O(n) per call

# GOOD: append then reverse -> O(n) total
out = []
for x in data:
    out.append(x)             # O(1) amortized
out.reverse()                 # O(n) once
```

```text
insert(0, x) must move all existing elements right by one:
[b, c, d]  --insert(0, a)-->  [a, b, c, d]   (b, c, d each shifted)
```

**Why this is good:** the two loops look equally innocent, but the first is quadratic
because each front-insert shifts the whole list. When you need front operations, reach
for `collections.deque` (Lesson 5), which makes them `O(1)`.

# Common Mistakes

- **`insert(0, x)` or `pop(0)` inside a loop.** Each is `O(n)`, so the loop is `O(n²)`.
  Use `append`/`pop()` at the end, or a `deque`.
- **Thinking a Python `list` is a linked list.** It is a dynamic array of references;
  indexing is `O(1)`, but front insertion is `O(n)`.
- **Assuming `x in a` is fast.** Membership on a `list` is `O(n)`; use a `set`/`dict`
  when you test membership repeatedly.
- **Growing by a constant amount** (e.g. +1 or +10) instead of a factor. That makes
  append `O(n)` amortized and building the list `O(n²)`.

# Best Practices

- Use `list` as your default sequence, and append/pop at the **end**.
- Preallocate with `[value] * n` when the size is known and you will index-assign.
- For frequent front/back operations, use `collections.deque`.
- Remember slicing and `list(...)` copies are `O(k)` in the number of elements copied.

# Summary

- An array stores elements contiguously, giving `O(1)` indexing via address arithmetic.
- A dynamic array grows by a constant factor, making append `O(1)` **amortized**.
- The geometric-series argument bounds total resize work at `O(n)` for `n` appends.
- Python's `list` is a dynamic array: end operations are cheap, front/middle are `O(n)`.
- Growing by a fixed amount instead of a factor destroys the amortized guarantee.

# Flash Cards

Q: Why is indexing an array a[i] O(1)?
A: The element's address is base + i·w, computed with one multiply and add — independent of i and n.

Q: Why is appending to a dynamic array O(1) amortized despite O(n) resizes?
A: Capacity grows by a constant factor, so total copying over n appends is a geometric series bounded by O(n) — averaging O(1) each.

Q: What is the cost of list.insert(0, x) in Python, and why?
A: O(n) — every existing element must shift one position to the right.

Q: Is a Python list a linked list?
A: No — it is a dynamic array of object references, which is why a[i] is O(1).

Q: What happens if a dynamic array grows by a fixed amount instead of a factor?
A: Resizes become frequent; append degrades to O(n) amortized and building the list becomes O(n²).

Q: What is the difference between a dynamic array's size and capacity?
A: Size is how many elements are stored; capacity is how many slots are currently allocated.

# Exercises

### Easy
State the time complexity of each on a Python list of length `n`: `a[i]`, `a.append(x)`,
`a.pop()`, `a.pop(0)`, `x in a`.

### Medium
Extend the `DynamicArray` class with an `insert(i, value)` method that shifts elements
right. What is its worst-case time, and for which `i` does the worst case occur?

### Challenging
Suppose a dynamic array grows by a factor of `1.5` instead of `2`. Argue that append is
still `O(1)` amortized, and explain the trade-off between the growth factor's effect on
wasted space versus how often resizes occur.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 10
  (elementary data structures) and Chapter 16 (amortized analysis, the aggregate method).
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 1.3 (resizing arrays).
- Python — [TimeComplexity wiki](https://wiki.python.org/moin/TimeComplexity) for `list` costs.
