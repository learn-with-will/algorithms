---
slug: binary-search-tree-property
title: "The Binary Search Tree Property"
topic: trees-and-heaps
kind: concept
summary: "In a BST, keys in the left subtree are smaller than the node's key, and keys in the right subtree are larger."
tags: ["bst", "binary-search-tree", "trees", "data-structures"]
related: ["bst-search-and-insertion", "bst-node-deletion", "tree-traversal-orders"]
---
> **In one line:** A Binary Search Tree enforces that left subtree keys are smaller and right subtree keys are larger than the root.

## The idea

A **Binary Search Tree (BST)** is a binary tree where every node satisfies the **BST property**:

Let $x$ be a node in a binary search tree:
- If $y$ is a node in the **left subtree** of $x$, then $\text{key}(y) < \text{key}(x)$.
- If $y$ is a node in the **right subtree** of $x$, then $\text{key}(y) > \text{key}(x)$.

```tree
Root: 50
  Left Subtree (< 50): 30
    Leaf: 20
    Leaf: 40
  Right Subtree (> 50): 70
    Leaf: 60
    Leaf: 80
```

This fundamental invariant holds recursively across every node in the tree. Because left branches are smaller and right branches are larger, an in-order traversal of a BST visits all keys in strictly ascending sorted order.

## See it

Validating the BST property in Python:

```python
class TreeNode:
    def __init__(self, val: int, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode | None, min_val=float('-inf'), max_val=float('inf')) -> bool:
    if not root:
        return True
    # Node must fall strictly within allowed interval
    if not (min_val < root.val < max_val):
        return False
    # Left children must be < root.val; right children must be > root.val
    return (is_valid_bst(root.left, min_val, root.val) and 
            is_valid_bst(root.right, root.val, max_val))

valid_tree = TreeNode(50, TreeNode(30), TreeNode(70))
print("Is valid BST:", is_valid_bst(valid_tree))  # True
```

## Go deeper

Notice that verifying a BST requires checking that **all** nodes in a left subtree are smaller than the ancestor root, not merely the immediate left child!

A common bug checks only `node.left.val < node.val`, which incorrectly validates invalid trees like `TreeNode(50, TreeNode(30, right=TreeNode(60)), None)` where 60 is in 50's left subtree. Passing valid $(min, max)$ intervals down during traversal prevents this mistake.

From an algorithmic engineering perspective, understanding the precise operational characteristics of the binary search tree property allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Checking only immediate child nodes is insufficient to validate the BST property across the entire tree.
- BST keys must be comparable; duplicate handling (<= vs <) must be uniformly specified.

## Remember

- BST property: left subtree keys < node key < right subtree keys.
- In-order traversal of a valid BST yields sorted key order.
- All operations cost O(h), where h is the tree height.
