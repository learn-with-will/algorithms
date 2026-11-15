---
slug: tree-rotations-single-and-double
title: "Tree Rotations: Left and Right"
topic: trees-and-heaps
kind: technique
summary: "Rotations alter local tree height while strictly preserving the underlying binary search tree order."
tags: ["rotations", "avl", "red-black-tree", "balancing"]
related: ["bst-degeneration-to-linked-list", "avl-tree-balance-factor", "avl-rebalancing-four-cases"]
---
> **In one line:** Tree rotations rearrange pointers in O(1) time to rebalance tree height while preserving BST order.

## The idea

A **tree rotation** is an $O(1)$ local pointer restructuring operation that changes the height of subtrees while **strictly preserving the BST invariant**.

Two symmetrical rotations exist:
- **Right Rotation (Rotate-Right):** Pulls the left child up to become the new parent, while the old parent descends to become the right child.
- **Left Rotation (Rotate-Left):** Pulls the right child up to become the new parent, while the old parent descends to become the left child.

```flow
unbal: Left-Heavy Root Y | height imbalance @amber
rot: Right Rotation | pull child X to root @primary
bal: Balanced Root X | BST order preserved @green
unbal -> rot
rot -> bal
```

Notice subtree $B$ is transferred smoothly: because $X < B < Y$, $B$ becomes the left child of $Y$ after right rotation, maintaining sorted order!

## See it

Implementation of left and right rotations in Python:

```python
class Node:
    def __init__(self, val: int, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def right_rotate(y: Node) -> Node:
    x = y.left
    assert x is not None, "Cannot right rotate with null left child"
    T2 = x.right
    
    # Perform rotation
    x.right = y
    y.left = T2
    return x  # New root of this subtree

def left_rotate(x: Node) -> Node:
    y = x.right
    assert y is not None, "Cannot left rotate with null right child"
    T2 = y.left
    
    # Perform rotation
    y.left = x
    x.right = T2
    return y  # New root of this subtree
```

## Go deeper

Both rotations update only three pointer references and take strictly **$O(1)$ constant time**.

Rotations form the atomic balancing mechanism for all self-balancing search trees (AVL trees, Red-Black trees, Treaps, and Splay trees). By applying rotations following insertions or deletions, trees maintain $O(\log n)$ height dynamically.

From an algorithmic engineering perspective, understanding the precise operational characteristics of tree rotations: left and right allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- When right-rotating y, subtree x.right must be reattached as y.left, or nodes are dropped.
- In trees tracking node heights or sizes, update node metadata bottom-up immediately after rotating.

## Remember

- Tree rotations alter subtree heights in O(1) time.
- Rotations strictly preserve the underlying in-order BST key ordering.
- Serve as the foundational rebalancing mechanism for AVL and Red-Black trees.
