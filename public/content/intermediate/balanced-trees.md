---
id: lesson-14
slug: balanced-trees
title: "Balanced Trees: AVL and Red-Black"
level: intermediate
order: 14
duration: 28
tags:
  - balanced-trees
  - avl
  - red-black-tree
  - rotations
  - trees
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain why a plain BST needs balancing and what "balanced" guarantees.
- Describe **rotations** and why they preserve the BST ordering.
- Summarize how **AVL** and **red-black** trees keep height `O(log n)`.
- Compare AVL (more rigidly balanced) with red-black (fewer rotations on updates).
- Name where self-balancing trees are used in real systems.

# Why This Concept Exists

The previous lesson ended on a problem: a plain BST built from sorted keys degenerates into
a linked list, and its `O(log n)` operations become `O(n)`. **Self-balancing** binary search
trees fix this. After every insert or delete they perform a little local restructuring —
**rotations** — to keep the height `O(log n)`, so search, insert, and delete are *guaranteed*
`O(log n)` no matter the input order. This guarantee is why balanced trees, not plain BSTs,
sit behind the ordered maps and sets in most standard libraries.

# Concept Explanation

### Rotations: local restructuring that preserves order

A **rotation** rearranges a few nodes to change the tree's shape while keeping the BST
ordering intact. A right rotation at `y`:

```text
        y                 x
       / \               / \
      x   C    ==>       A   y
     / \                    / \
    A   B                  B   C
```

Before and after, the in-order sequence is `A x B y C` — unchanged. That is the whole point:
rotations rebalance without disturbing the sorted order, and they are `O(1)` (a constant
number of pointer updates). A **left rotation** is the mirror image.

### AVL trees — strict height balance

An **AVL tree** keeps, for every node, the heights of its two subtrees differing by at most
**1** (its *balance factor* is −1, 0, or +1). After an insertion or deletion unbalances a
node, one or two rotations restore the invariant. Four cases describe the imbalance —
Left-Left and Right-Right need a single rotation; Left-Right and Right-Left need a double
rotation. This strict balance keeps the height below about `1.44·log₂ n`, giving very fast
lookups at the cost of doing more rotations on updates.

### Red-black trees — looser balance, fewer rotations

A **red-black tree** colors each node red or black and enforces rules (the root is black, red
nodes have black children, and every root-to-leaf path has the same number of black nodes).
These rules bound the height at `2·log₂(n+1)` — still `O(log n)`, but a looser balance than
AVL. The payoff is that red-black trees need **fewer rotations per update**, which makes them
better for insert/delete-heavy workloads. They are the most widely used balanced BST.

### Both guarantee O(log n)

Whichever scheme, the height stays `O(log n)`, so search, insert, and delete are all
`O(log n)` in the worst case — the guarantee a plain BST lacks. AVL trees favor lookup-heavy
use; red-black trees favor update-heavy use.

# Key Terminology

- **Balanced** — height kept `O(log n)`, so operations are `O(log n)`.
- **Rotation** — `O(1)` local restructuring that preserves in-order ordering.
- **Balance factor** — height(left) − height(right); AVL keeps it in {−1, 0, +1}.
- **AVL tree** — strictly height-balanced BST.
- **Red-black tree** — color-rule balanced BST with looser balance, fewer rotations.

# Complexity

| Operation | AVL | Red-Black | Plain BST (worst) |
| --------- | --- | --------- | ----------------- |
| Search | O(log n) | O(log n) | O(n) |
| Insert | O(log n) | O(log n) | O(n) |
| Delete | O(log n) | O(log n) | O(n) |
| Rotations per update | up to O(log n) (usually few) | O(1) amortized-ish | — |

Both use `O(n)` space and guarantee logarithmic operations.

# Implementation in Python

Rotations plus a complete AVL insert (the concrete core of self-balancing):

```python
from dataclasses import dataclass
from typing import Optional


@dataclass
class Node:
    key: int
    height: int = 1
    left: Optional["Node"] = None
    right: Optional["Node"] = None


def _h(n: Optional[Node]) -> int:
    return n.height if n else 0

def _update(n: Node) -> None:
    n.height = 1 + max(_h(n.left), _h(n.right))

def _balance(n: Node) -> int:
    return _h(n.left) - _h(n.right)

def rotate_right(y: Node) -> Node:
    x = y.left
    y.left = x.right          # B moves under y
    x.right = y
    _update(y); _update(x)    # order matters: update the lower node first
    return x                  # x is the new subtree root

def rotate_left(x: Node) -> Node:
    y = x.right
    x.right = y.left
    y.left = x
    _update(x); _update(y)
    return y

def avl_insert(root: Optional[Node], key: int) -> Node:
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = avl_insert(root.left, key)
    elif key > root.key:
        root.right = avl_insert(root.right, key)
    else:
        return root                    # duplicate: ignore

    _update(root)
    bf = _balance(root)

    if bf > 1 and key < root.left.key:      # Left-Left
        return rotate_right(root)
    if bf < -1 and key > root.right.key:     # Right-Right
        return rotate_left(root)
    if bf > 1 and key > root.left.key:       # Left-Right
        root.left = rotate_left(root.left)
        return rotate_right(root)
    if bf < -1 and key < root.right.key:     # Right-Left
        root.right = rotate_right(root.right)
        return rotate_left(root)
    return root
```

# Real World Analogy

A balanced tree is a **well-managed org chart**. If everyone reported to the person hired
just before them, the chart would be one giant chain and reaching the bottom would take
forever. Instead, a good structure keeps the hierarchy *shallow and even* — no branch far
deeper than another — so anyone is reachable in a few hops. Rotations are the occasional
reorganizations that keep the chart from getting lopsided as people join and leave.

# Examples

## Example 1 — Basic: a rotation fixes a sorted insert

```python
root = None
for k in [1, 2, 3]:          # sorted keys that would make a plain BST a chain
    root = avl_insert(root, k)
# After inserting 3, the Right-Right case triggers a left rotation at 1:
#   plain BST:  1 - 2 - 3  (height 3)   ->   AVL:   2
#                                                  / \
#                                                 1   3   (height 2)
```

**Why this is good:** the exact input that ruins a plain BST is kept balanced by a single
rotation, so the height stays `O(log n)` and search remains `O(log n)`.

## Example 2 — Real-world: where balanced BSTs live

```text
Red-black trees:  Java TreeMap / TreeSet, C++ std::map / std::set,
                  and the Linux kernel's rbtree (e.g. the CFS scheduler).
AVL trees:        databases and in-memory indexes where lookups dominate.
```

**Why this is good:** it grounds the theory — the ordered maps and sets you use in mainstream
languages are red-black trees underneath, which is why their operations are guaranteed
`O(log n)` and their iteration is sorted.

## Example 3 — Best practice / edge case: choosing AVL vs red-black

```text
Lookup-heavy, few updates   -> AVL (tighter balance -> shorter -> faster search)
Update-heavy (insert/delete) -> Red-black (fewer rotations per update)
```

**Why this is good:** both are `O(log n)`, so the choice is about constants. AVL's stricter
balance makes reads a touch faster; red-black's looser balance makes writes cheaper. Knowing
the trade-off lets you pick — or explain why your library chose red-black.

# Common Mistakes

- **Thinking a rotation can break the ordering.** A correct rotation preserves the in-order
  sequence; if your in-order output changes, the rotation is wrong.
- **Assuming a plain BST self-balances.** It does not — only trees with explicit balancing
  logic (AVL, red-black, B-trees) stay `O(log n)`.
- **Confusing which is more balanced.** AVL is *more* strictly balanced (faster lookups);
  red-black is *looser* (fewer rotations, faster updates).
- **Hand-rolling a red-black tree in a hurry.** Deletion is notoriously fiddly; use a tested
  library unless you are implementing it to learn.

# Best Practices

- Never depend on a plain BST staying balanced; use a self-balancing tree or a library.
- Choose **AVL** for read-dominated workloads, **red-black** for write-dominated ones.
- Verify a balancing implementation by checking the in-order traversal stays sorted and the
  height stays `≈ log n` after many random inserts/deletes.
- In Python, reach for `dict`/`set` (hashing) when you do not need order; use
  `sortedcontainers` (third-party) when you need an ordered structure without writing a tree.

# Summary

- Balanced BSTs keep height `O(log n)`, guaranteeing `O(log n)` search/insert/delete.
- **Rotations** are `O(1)` restructurings that rebalance while preserving in-order order.
- **AVL** trees are strictly balanced (balance factor ≤ 1) — faster lookups, more rotations.
- **Red-black** trees use color rules for looser balance — fewer rotations, better for updates.
- Real ordered maps/sets (Java, C++, Linux kernel) are red-black trees.

# Flash Cards

Q: What does a rotation preserve, and how long does it take?
A: It preserves the BST's in-order ordering and runs in O(1) — a constant number of pointer changes.

Q: What height do balanced BSTs guarantee, and why does it matter?
A: O(log n), which makes search, insert, and delete O(log n) in the worst case — the guarantee a plain BST lacks.

Q: What balance invariant does an AVL tree maintain?
A: For every node, the heights of its two subtrees differ by at most 1 (balance factor in {-1, 0, +1}).

Q: How does a red-black tree differ from an AVL tree in practice?
A: It is more loosely balanced via color rules, so it needs fewer rotations per update — better for insert/delete-heavy workloads.

Q: Which balanced tree backs Java's TreeMap and C++'s std::map?
A: A red-black tree.

Q: Does a plain (unbalanced) BST self-balance?
A: No — only trees with explicit balancing logic (AVL, red-black, B-trees) keep height O(log n).

# Exercises

### Easy
Draw the tree after inserting `10, 20, 30` into an AVL tree. Which rotation case fires, and
what is the resulting root?

### Medium
Using the `avl_insert` code, insert `30, 20, 10` (the Left-Left case) and then `10, 20, 15`
(the Left-Right case). Verify by hand that each resulting tree has height 2 and is balanced.

### Challenging
Explain why an AVL tree with height `h` contains at least `F(h+2) − 1` nodes, where `F` is
the Fibonacci sequence, and use that to argue the height is `O(log n)`. (These minimal AVL
trees are called Fibonacci trees.)

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 13
  ("Red-Black Trees"); AVL trees appear in the problems.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 3.3 ("Balanced Search Trees",
  left-leaning red-black trees).
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Section 3.4 (balanced search trees).
