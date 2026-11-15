---
slug: bst-node-deletion
title: "BST Node Deletion Cases"
topic: trees-and-heaps
kind: technique
summary: "Delete BST nodes by handling three structural cases: leaf nodes, single child nodes, and two-child nodes."
tags: ["bst", "deletion", "in-order-successor", "trees"]
related: ["binary-search-tree-property", "bst-search-and-insertion", "tree-rotations-single-and-double"]
---
> **In one line:** Deleting a BST node handles three cases: leaves, nodes with one child, and nodes with two children.

## The idea

Deleting a node from a BST is more intricate than insertion because removing an internal node can disconnect its subtrees.

Deletion handles three distinct structural cases:

| Case | Scenario | Deletion Strategy |
|---|---|---|
| **Case 1** | Node is a **leaf** (0 children) | Simply delete the node (set parent's pointer to `None`). |
| **Case 2** | Node has **one child** | Bypass the node: link the parent directly to the single child. |
| **Case 3** | Node has **two children** | Find the **in-order successor** (smallest key in right subtree), copy its value into the target node, and recursively delete the successor. |

Because the in-order successor has at most one child (it cannot have a left child by definition!), deleting the successor reduces to Case 1 or Case 2.

## See it

Complete BST deletion in Python:

```python
def delete_node(root: TreeNode | None, key: int) -> TreeNode | None:
    if not root:
        return None
        
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        # Case 1 & 2: 0 or 1 child
        if not root.left:
            return root.right
        elif not root.right:
            return root.left
            
        # Case 3: 2 children -> find in-order successor (min in right subtree)
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val = successor.val  # Copy value
        # Delete duplicate successor from right subtree
        root.right = delete_node(root.right, successor.val)
        
    return root
```

## Go deeper

Why does replacing a deleted node with its in-order successor maintain the BST property?

The in-order successor is strictly greater than all nodes in the left subtree (because it came from the right subtree), and it is smaller than all other nodes in the right subtree (because it was the minimum of that subtree). 

Alternatively, the **in-order predecessor** (maximum key in the left subtree) can be used symmetrically with identical correctness.

From an algorithmic engineering perspective, understanding the precise operational characteristics of bst node deletion cases allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- In Case 3, do not physically re-link complex multi-child pointers; copying the successor's value is vastly simpler.
- Remember that deletion in an unbalanced BST takes O(h) time, which can degrade to O(n).

## Remember

- Case 1 (leaf): disconnect immediately.
- Case 2 (1 child): bypass node and link parent to child.
- Case 3 (2 children): replace with in-order successor, then delete successor.
