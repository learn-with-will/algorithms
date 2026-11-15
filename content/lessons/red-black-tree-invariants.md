---
slug: red-black-tree-invariants
title: "Red-Black Tree Invariants"
topic: trees-and-heaps
kind: concept
summary: "Red-black trees balance search trees using node coloring, red-child restrictions, and black-height uniformity."
tags: ["red-black-tree", "coloring", "invariants", "balanced-trees"]
related: ["avl-tree-balance-factor", "avl-rebalancing-four-cases", "avl-vs-red-black-trees"]
---
> **In one line:** Red-black trees maintain balance using five color rules, bounding maximum height to 2 * log2(n + 1).

## The idea

A **Red-Black Tree** is a self-balancing binary search tree where each node stores an extra color bit: **Red** or **Black**.

A binary search tree is a valid Red-Black Tree if and only if it satisfies five strict invariants:

1. **Node Color:** Every node is either Red or Black.
2. **Root Property:** The root node is always Black.
3. **Leaf Property:** Every leaf (NIL sentinel node) is Black.
4. **Red Property:** If a node is Red, both of its children must be Black (no two consecutive Red nodes along any path).
5. **Black-Height Property:** For each node, all simple paths from the node to descendant leaves contain the exact same number of Black nodes.

```flow
r: Root Node (Black) | height 1 @neutral
n1: Left Child (Red) | valid red node @primary
n2: Right Child (Black) | valid black node @neutral
l1: Black Leaf NIL @neutral
l2: Black Leaf NIL @neutral
r -> n1
r -> n2
n1 -> l1
n1 -> l2
```

## See it

Checking Red-Black invariants on a node structure:

```python
class RBNode:
    RED = True
    BLACK = False
    def __init__(self, val: int, color: bool = RED):
        self.val = val
        self.color = color
        self.left: 'RBNode | None' = None
        self.right: 'RBNode | None' = None

def is_black(node: RBNode | None) -> bool:
    # NIL leaves are considered Black
    return node is None or node.color == RBNode.BLACK

root = RBNode(20, RBNode.BLACK)
root.left = RBNode(10, RBNode.RED)
root.right = RBNode(30, RBNode.BLACK)

# Invariant 4 check: no red node has red children
assert is_black(root.left.left) and is_black(root.left.right)
```

## Go deeper

Why do these five coloring rules guarantee balance?

Consider the shortest possible path from root to leaf: it consists entirely of Black nodes of length $B$ (the black-height). The longest possible path alternates Red and Black nodes, containing $B$ Black nodes and $B$ Red nodes of total length $2B$.

Because the longest path is at most twice the length of the shortest path, the tree is approximately balanced:
$$h \le 2 \log_2(n + 1)$$
This bounds all operations to guaranteed **$O(\log n)$ worst-case time**.

From an algorithmic engineering perspective, understanding the precise operational characteristics of red-black tree invariants allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- NIL leaves are conceptually Black; do not evaluate missing children as uncolored.
- Two consecutive Red nodes along any vertical path violates Invariant 4.

## Remember

- Root and NIL leaves are always Black.
- Red nodes cannot have Red children (no consecutive Reds).
- Black-height is identical along all paths from root to leaves.
