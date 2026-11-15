---
slug: avl-rebalancing-four-cases
title: "AVL Rebalancing: Four Imbalance Cases"
topic: trees-and-heaps
kind: pattern
summary: "Restore AVL balance using single rotations (LL, RR) or double rotations (LR, RL) following updates."
tags: ["avl", "rebalancing", "rotations", "patterns"]
related: ["tree-rotations-single-and-double", "avl-tree-balance-factor", "avl-vs-red-black-trees"]
---
> **In one line:** AVL imbalances fall into four canonical cases resolved by either single or double rotations.

## The idea

When inserting a new key into an AVL tree, the balance factor of an ancestor can become $+2$ or $-2$. Rebalancing requires diagnosing which of **four canonical cases** caused the imbalance:

| Case | Condition | Shape | Rotation Required |
|---|---|---|---|
| **Left-Left (LL)** | $\text{BF}(node) > 1$ and $key < node.left.val$ | Straight line left | **Single Right Rotation** on node |
| **Right-Right (RR)** | $\text{BF}(node) < -1$ and $key > node.right.val$ | Straight line right | **Single Left Rotation** on node |
| **Left-Right (LR)** | $\text{BF}(node) > 1$ and $key > node.left.val$ | Zig-zag left-right | **Double Rotation:** Left on child, then Right on node |
| **Right-Left (RL)** | $\text{BF}(node) < -1$ and $key < node.right.val$ | Zig-zag right-left | **Double Rotation:** Right on child, then Left on node |

In zig-zag cases (LR, RL), a single rotation fails because the imbalance is crooked; the first rotation straightens the line, and the second rotation restores balance.

## See it

Complete AVL insertion with four-case rebalancing:

```python
def insert_avl(node: AVLNode | None, key: int) -> AVLNode:
    if not node: return AVLNode(key)
    if key < node.val: node.left = insert_avl(node.left, key)
    elif key > node.val: node.right = insert_avl(node.right, key)
    else: return node
    node.height = 1 + max(get_height(node.left), get_height(node.right))
    balance = get_balance(node)
    # Rebalance cases
    if balance > 1 and key < node.left.val:
        return right_rotate(node)
    if balance < -1 and key > node.right.val:
        return left_rotate(node)
    if balance > 1 and key > node.left.val:
        node.left = left_rotate(node.left)
        return right_rotate(node)
    if balance < -1 and key < node.right.val:
        node.right = right_rotate(node.right)
        return left_rotate(node)
    return node
```

## Go deeper

An extraordinary property of AVL insertion: **at most two rotations** (one double rotation) are ever needed to restore balance across the entire tree following an insert! 

Once the local subtree is rebalanced, its height matches its pre-insertion height, terminating balance propagation to upper ancestors. During deletion, however, rebalancing may propagate up the entire path to the root, requiring up to $O(\log n)$ rotations.

From an algorithmic engineering perspective, understanding the precise operational characteristics of avl rebalancing: four imbalance cases allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- In Left-Right and Right-Left cases, you must rotate the child first before rotating the parent.
- Always recalculate node heights immediately after executing each rotation.

## Remember

- Straight-line imbalances (LL, RR) are resolved with a single rotation.
- Zig-zag imbalances (LR, RL) require a double rotation (child first, then parent).
- Insertion requires at most one rebalancing rotation to restore full tree balance.
