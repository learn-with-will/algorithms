---
id: lesson-04
slug: linked-lists
title: "Linked Lists"
level: beginner
order: 4
duration: 26
tags:
  - linked-list
  - nodes
  - pointers
  - data-structures
  - singly-linked
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the **node / pointer** model of a singly and doubly linked list.
- Explain why linked lists give `O(1)` insertion/deletion but only `O(n)` access.
- Insert at the head, traverse, and reverse a linked list correctly.
- Use a **sentinel (dummy) head** to remove special-casing.
- Choose between an array and a linked list for a given workload.

# Why This Concept Exists

An array stores elements contiguously, which is great for indexing but painful for
insertion: adding an element in the middle means shifting everything after it. A
**linked list** trades away random access to buy cheap insertion and deletion. Instead
of one contiguous block, it scatters elements across memory and threads them together
with pointers. Given a reference to a node, you can splice a new element in or unlink an
old one in constant time — no shifting, no reallocation. Understanding this trade-off is
the foundation for stacks, queues, hash-table chaining, and adjacency lists later on.

# Concept Explanation

### Nodes and pointers

A linked list is built from **nodes**. Each node holds a **value** and a reference (a
**pointer**) to the next node. The list keeps a **head** pointer to the first node; the
last node's `next` is `None`, marking the end.

```text
head
 |
 v
[7|-]--->[3|-]--->[9|-]--->[1|/]      ( / = None )
```

Because nodes are not contiguous, there is no address arithmetic: to reach the `k`-th
element you must start at the head and follow `k` pointers. Access and search are
therefore `O(n)`.

### Singly vs. doubly linked

- A **singly linked list** node has one pointer, `next`. You can move forward only.
- A **doubly linked list** node has two pointers, `next` and `prev`. You can move both
  ways, which makes deleting a node you already hold `O(1)` (you can reach its
  predecessor) and enables an `O(1)` tail.

### The costs

Given a **reference to a node**, splicing in or removing a neighbour is `O(1)` — you
just rewire a couple of pointers. But *finding* the place to splice is `O(n)`, because
you have to walk there. So:

- Insert/delete at the **head**: `O(1)`.
- Insert/delete after a **known node**: `O(1)`.
- Insert/delete at the **tail**: `O(1)` only if you keep a tail pointer (and, for
  deletion, the list is doubly linked); otherwise `O(n)`.
- Access or search by position/value: `O(n)`.

### Sentinel nodes

Edge cases at the head (inserting into an empty list, deleting the first node) clutter
linked-list code with `if head is None` checks. A **sentinel** (or dummy) node — a
placeholder node that always sits before the real first element — removes those special
cases, because every real node now has a predecessor.

# Key Terminology

- **Node** — a container holding a value and one or more pointers.
- **Head / tail** — pointers to the first / last node.
- **Singly / doubly linked** — one forward pointer / both forward and backward.
- **Traversal** — walking node to node via `next`.
- **Sentinel (dummy) node** — a placeholder node that eliminates head/empty edge cases.

# Complexity

For a singly linked list of `n` nodes (head pointer only):

| Operation | Time | Notes |
| --------- | ---- | ----- |
| Access / search by index or value | O(n) | must traverse |
| Insert / delete at head | O(1) | rewire head |
| Insert / delete after a known node | O(1) | rewire two pointers |
| Insert at tail | O(n) | O(1) with a tail pointer |
| Delete at tail | O(n) | need the predecessor (O(1) if doubly linked) |

Space is `O(n)`, with a per-node overhead for the pointer(s) — more memory than an array
holding the same values.

# Implementation in Python

```python
from dataclasses import dataclass
from typing import Optional


@dataclass
class Node:
    value: int
    next: Optional["Node"] = None


class LinkedList:
    def __init__(self) -> None:
        self.head: Optional[Node] = None

    def push_front(self, value: int) -> None:
        """Insert at the head — O(1)."""
        self.head = Node(value, self.head)

    def __iter__(self):
        node = self.head
        while node is not None:      # traversal — O(n)
            yield node.value
            node = node.next

    def find(self, target: int) -> bool:
        for value in self:           # O(n) linear search
            if value == target:
                return True
        return False
```

# Real World Analogy

A linked list is a **scavenger hunt**. Each clue (node) tells you where to find the next
clue, but nothing tells you where clue #5 is without visiting 1 through 4 first — that
is `O(n)` access. Adding a new clue is easy, though: you only have to edit the two clues
on either side to point to the newcomer, no matter how long the hunt is — that is `O(1)`
splicing.

# Examples

## Example 1 — Basic: build and print a list

```python
lst = LinkedList()
for v in [9, 3, 7]:
    lst.push_front(v)     # each push is O(1)

print(list(lst))          # [7, 3, 9] -- reversed, since we pushed to the front
```

**Why this is good:** it shows the defining moves — `O(1)` head insertion and `O(n)`
traversal — and makes clear that pushing to the front reverses insertion order.

## Example 2 — Real-world: reverse a linked list in place

```python
def reverse(head: Optional[Node]) -> Optional[Node]:
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next     # 1. remember the rest BEFORE rewiring
        curr.next = prev    # 2. flip this node's pointer
        prev = curr         # 3. advance prev
        curr = nxt          # 4. advance curr
    return prev             # new head
```

```text
None <- [7]   [3] -> [9] -> /      (after flipping the first node)
        prev  curr
```

**Why this is good:** reversing a list is `O(n)` time and `O(1)` space, and it drills
the one rule that governs all pointer surgery: **save the next pointer before you
overwrite it**, or you lose the rest of the list.

## Example 3 — Best practice / edge case: a sentinel head

```python
def insert_sorted(dummy: Node, value: int) -> None:
    """Insert into an ascending list that starts with a sentinel `dummy`."""
    prev = dummy
    while prev.next is not None and prev.next.value < value:
        prev = prev.next
    prev.next = Node(value, prev.next)   # works even when inserting first/last
```

**Why this is good:** with a sentinel there is no separate "insert before the head" case
— every real node has a predecessor `prev`, so one line handles inserting at the front,
middle, or end. Sentinels are how production linked-list code stays free of `None` checks.

# Common Mistakes

- **Overwriting `next` before saving it**, which orphans the rest of the list. Always
  capture `node.next` first (see the `reverse` example).
- **Assuming random access.** `lst[k]` is not `O(1)`; reaching the `k`-th node is `O(k)`.
- **Forgetting the empty/head case** — the reason to use a sentinel node.
- **Using a linked list by default.** Arrays are usually faster in practice thanks to
  contiguous memory and cache locality; reach for a linked list only when you truly need
  `O(1)` splicing without shifting.

# Best Practices

- Use a **sentinel head** to eliminate special-casing.
- Keep a **tail pointer** if you append often; use a **doubly linked** list if you delete
  arbitrary nodes.
- Prefer `list`/`deque` in Python unless you specifically need node-level splicing —
  `collections.deque` is a doubly linked list under the hood with a clean API.
- When rewiring, write the pointer updates in an order that never loses a reference.

# Summary

- A linked list threads nodes together with pointers instead of storing them contiguously.
- Access and search are `O(n)`; insertion/deletion at the head or a known node is `O(1)`.
- Doubly linked lists add a `prev` pointer, enabling `O(1)` deletion of a held node.
- Save the `next` pointer before overwriting it, or you lose the tail of the list.
- Sentinel nodes remove head/empty edge cases; arrays still win when you need indexing.

# Flash Cards

Q: Why is accessing the k-th element of a linked list O(k), not O(1)?
A: Nodes are not contiguous in memory, so there is no address arithmetic — you must follow k pointers from the head.

Q: Why is inserting at the head of a linked list O(1)?
A: You only create a node and rewire the head pointer; nothing has to shift.

Q: What extra ability does a doubly linked list give over a singly linked one?
A: A prev pointer lets you move backward and delete a node you already hold in O(1), and supports an O(1) tail.

Q: What is the golden rule when rewiring pointers during reversal?
A: Save the node's next pointer before overwriting it, or you orphan the rest of the list.

Q: What problem does a sentinel (dummy) head node solve?
A: It gives every real node a predecessor, removing the special cases for inserting/deleting at the head or in an empty list.

Q: When should you prefer a linked list over a dynamic array?
A: When you need frequent O(1) insertion/deletion at known positions without shifting, and you don't need random access or cache-friendly scans.

# Exercises

### Easy
Write a method `length()` for `LinkedList` that returns the number of nodes. What is its
time complexity?

### Medium
Write `push_back(value)` that appends to the end of the singly linked list above. What is
its complexity, and how would adding a `tail` pointer change it?

### Challenging
Detect whether a singly linked list contains a cycle using `O(1)` extra space. (Hint:
Floyd's "tortoise and hare" — two pointers moving at different speeds.) Explain why the
fast and slow pointers must meet if and only if there is a cycle.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 10,
  Section 10.2 ("Linked lists").
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 1.3 (linked lists, stacks, and queues).
- Python — [`collections.deque`](https://docs.python.org/3/library/collections.html#collections.deque),
  a doubly linked list with `O(1)` operations at both ends.
