---
id: lesson-13
slug: binary-search-trees
title: "Binary Search Trees"
level: intermediate
order: 13
duration: 30
tags:
  - bst
  - binary-search-tree
  - trees
  - traversal
  - ordered-map
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **BST property** and why it applies to whole subtrees, not just children.
- Implement search, insert, and delete on a binary search tree.
- Explain why an **in-order traversal** yields keys in sorted order.
- Analyze BST operations as `O(h)` and see why height, not size, is what matters.
- Explain how an unbalanced BST degrades to `O(n)` — motivating balanced trees.

# Why This Concept Exists

Hash tables give `O(1)`-average lookup but no order: you cannot ask "what is the smallest
key above 50?" or list keys in sorted order efficiently. A **binary search tree** keeps
keys *ordered* while still supporting `O(log n)` search, insert, and delete when balanced.
That makes it the classic structure behind **ordered maps and sets**, range queries, and
"successor/predecessor" lookups. It is also your first real tree structure, and the ideas —
recursive structure, traversals, height — carry into balanced trees, heaps, and tries.

# Concept Explanation

### The BST property

A **binary search tree** is a binary tree where every node has a key, and for **every**
node:

- all keys in its **left** subtree are **less** than the node's key, and
- all keys in its **right** subtree are **greater** than the node's key.

The property is **recursive**: it must hold for every node, so an entire left subtree is
less than the node — not merely the immediate left child.

```text
              8
           /     \
          3       10
        /   \       \
       1     6       14
            / \      /
           4   7   13      (in-order: 1 3 4 6 7 8 10 13 14  -> sorted!)
```

### Search, insert, delete

- **Search** — compare the target to the node; go left if smaller, right if larger, repeat.
  You follow one root-to-leaf path, so it is `O(h)` where `h` is the tree's height.
- **Insert** — search for where the key belongs; add it as a new leaf. Also `O(h)`.
- **Delete** — three cases:
  - a **leaf**: just remove it;
  - **one child**: replace the node with that child;
  - **two children**: replace the node's key with its **in-order successor** (the smallest
    key in the right subtree), then delete that successor. Still `O(h)`.

### In-order traversal gives sorted order

An **in-order** traversal visits *left subtree, then node, then right subtree*. Because
everything left of a node is smaller and everything right is larger, this visits keys in
**ascending sorted order** — an `O(n)` way to list a BST's contents in order.

### Height is everything

Every operation costs `O(h)`. If the tree is **balanced**, `h = O(log n)` and operations
are `O(log n)`. But if you insert already-sorted keys into a plain BST, each new key becomes
the right child of the last — the tree degenerates into a linked list with `h = n`, and
operations become `O(n)`. Keeping `h` small is exactly what balanced trees (next lesson) do.

# Key Terminology

- **BST property** — left subtree < node < right subtree, for every node.
- **Height `h`** — longest root-to-leaf path; governs all operation costs.
- **In-order traversal** — left, node, right; yields sorted keys.
- **In-order successor** — the next-larger key; the leftmost node of the right subtree.
- **Degenerate tree** — an unbalanced BST that behaves like a linked list (`h = n`).

# Complexity

| Operation | Balanced | Worst (degenerate) |
| --------- | -------- | ------------------ |
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| In-order traversal | O(n) | O(n) |

All operations are `O(h)`; balance makes `h = O(log n)`.

# Implementation in Python

```python
from dataclasses import dataclass
from typing import Optional


@dataclass
class Node:
    key: int
    left: Optional["Node"] = None
    right: Optional["Node"] = None


def insert(root: Optional[Node], key: int) -> Node:
    if root is None:
        return Node(key)              # found the empty spot -> new leaf
    if key < root.key:
        root.left = insert(root.left, key)
    elif key > root.key:
        root.right = insert(root.right, key)
    return root                       # duplicates ignored


def search(root: Optional[Node], key: int) -> bool:
    node = root
    while node is not None:
        if key == node.key:
            return True
        node = node.left if key < node.key else node.right
    return False


def inorder(root: Optional[Node]) -> list[int]:
    if root is None:
        return []
    return inorder(root.left) + [root.key] + inorder(root.right)   # sorted output
```

# Real World Analogy

A BST is a game of **"guess the number" with hints**. You guess the middle; the answer is
"higher" or "lower"; you move to that half and repeat. Each node is a guess, and the
left/right children are the "lower"/"higher" branches. If the tree is balanced, you zero in
in `O(log n)` guesses — but if someone stacked the hints so every answer is "higher", you
are back to asking one number at a time, `O(n)`.

# Examples

## Example 1 — Basic: build and search

```python
root = None
for k in [8, 3, 10, 1, 6, 14]:
    root = insert(root, k)

search(root, 6)    # True
search(root, 5)    # False
inorder(root)      # [1, 3, 6, 8, 10, 14]
```

**Why this is good:** the same comparisons that place a key on insert also find it on
search, and `inorder` confirms the ordering invariant by producing a sorted list.

## Example 2 — Real-world: an ordered set with range queries

```python
def keys_in_range(root, low, high, out):
    if root is None:
        return
    if low < root.key:
        keys_in_range(root.left, low, high, out)   # prune: skip right if too big
    if low <= root.key <= high:
        out.append(root.key)
    if root.key < high:
        keys_in_range(root.right, low, high, out)
```

**Why this is good:** the BST ordering lets a range query **prune** entire subtrees that
cannot contain in-range keys, so it visits only the relevant part of the tree. This is
something a hash set cannot do — the reason ordered structures exist.

## Example 3 — Best practice / edge case: the degenerate tree

```python
root = None
for k in [1, 2, 3, 4, 5]:      # inserting SORTED keys
    root = insert(root, k)
# tree is a right-leaning chain: 1 -> 2 -> 3 -> 4 -> 5, height = n
# search(root, 5) now costs O(n), not O(log n)
```

**Why this is good:** it shows the plain BST's fatal flaw. Ordered or adversarial insertions
build a linked list, so operations become `O(n)`. This is precisely why self-balancing trees
exist — the subject of the next lesson.

# Common Mistakes

- **Checking only immediate children.** The BST property is about entire subtrees; a valid
  BST check must bound each node by a `(min, max)` range, not just compare to its children.
- **Mishandling two-child deletion.** Replace with the in-order successor (or predecessor),
  then delete that node — do not just remove the node.
- **Assuming `O(log n)`.** A plain BST is `O(log n)` only if balanced; sorted inserts make
  it `O(n)`.
- **Deep recursion on a degenerate tree.** A chain of height `n` can overflow the recursion
  stack; balanced trees keep recursion shallow.

# Best Practices

- Use a BST when you need **ordered** operations (sorted iteration, range queries,
  successor/predecessor); use a hash set/map when you only need membership.
- In production, use a **self-balancing** tree (next lesson) or a library structure — never
  rely on a plain BST staying balanced.
- Validate a BST by passing down a `(low, high)` range, not by comparing neighbors.
- In Python, prefer `dict`/`set` for unordered needs; there is no built-in balanced BST.

# Summary

- A BST keeps keys ordered: left subtree < node < right subtree, recursively.
- Search, insert, and delete are `O(h)`; in-order traversal lists keys sorted in `O(n)`.
- Two-child deletion replaces the node with its in-order successor.
- Height governs cost: balanced ⇒ `O(log n)`, degenerate (sorted inserts) ⇒ `O(n)`.
- Keeping height small is the job of balanced trees, coming next.

# Flash Cards

Q: State the binary-search-tree property.
A: For every node, all keys in its left subtree are less than it and all keys in its right subtree are greater — recursively for whole subtrees.

Q: Which traversal of a BST visits keys in ascending sorted order?
A: In-order traversal (left subtree, node, right subtree).

Q: What is the time complexity of BST search, and what does it depend on?
A: O(h), the height of the tree — O(log n) if balanced, O(n) if degenerate.

Q: How do you delete a node with two children from a BST?
A: Replace its key with its in-order successor (smallest key in the right subtree), then delete that successor node.

Q: Why does inserting already-sorted keys into a plain BST give O(n) operations?
A: Each key becomes the child of the previous one, so the tree degenerates into a linked list of height n.

Q: When should you choose a BST over a hash table?
A: When you need ordered operations — sorted iteration, range queries, or successor/predecessor — which a hash table cannot do efficiently.

# Exercises

### Easy
Write a recursive `height(root)` for a BST. Using it, confirm that inserting `[4, 2, 6, 1,
3, 5, 7]` gives height 2 (a balanced tree of 7 nodes).

### Medium
Write `is_valid_bst(root)` that verifies the BST property correctly by threading a
`(low, high)` allowed range through the recursion. Show why comparing only to immediate
children is insufficient.

### Challenging
Implement `delete(root, key)` handling all three cases (leaf, one child, two children) using
the in-order successor. Argue that it preserves the BST property and runs in `O(h)`.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 12
  ("Binary Search Trees").
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 3.2 ("Binary Search Trees").
- Python — for ordered maps in practice, see the third-party
  [`sortedcontainers`](https://grantjenks.com/docs/sortedcontainers/) library or the
  built-in [`bisect`](https://docs.python.org/3/library/bisect.html) on a sorted list.
