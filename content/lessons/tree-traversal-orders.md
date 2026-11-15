---
slug: tree-traversal-orders
title: "Binary Tree Traversal Orders"
topic: trees-and-heaps
kind: pattern
summary: "Traverse tree nodes in pre-order (copying), in-order (sorted keys), or post-order (deletion and evaluation)."
tags: ["tree-traversal", "in-order", "pre-order", "post-order"]
related: ["binary-search-tree-property", "breadth-first-search-bfs", "depth-first-search-dfs"]
---
> **In one line:** Tree traversals visit every node in O(n) time: pre-order, in-order, or post-order.

## The idea

A tree traversal algorithm systematically visits every node in the tree exactly once, running in **$\Theta(n)$ linear time**.

Depth-First Traversals are distinguished by when the current node is processed relative to its children:

| Traversal | Visiting Order | Primary Application |
|---|---|---|
| **In-Order** | Left $\to$ **Node** $\to$ Right | Yields keys in ascending sorted order for BSTs. |
| **Pre-Order** | **Node** $\to$ Left $\to$ Right | Serialization, copying trees, prefix expression evaluation. |
| **Post-Order** | Left $\to$ Right $\to$ **Node** | Deleting trees bottom-up, evaluating postfix expression trees. |
| **Level-Order** | Breadth-first level by level | Layer-by-layer inspection using a FIFO queue. |

```tree
Root (2)
  Left (1)
  Right (3)
```

## See it

Implementing in-order, pre-order, and post-order generators:

```python
def in_order(root: TreeNode | None):
    if root:
        yield from in_order(root.left)
        yield root.val
        yield from in_order(root.right)

def pre_order(root: TreeNode | None):
    if root:
        yield root.val
        yield from pre_order(root.left)
        yield from pre_order(root.right)

def post_order(root: TreeNode | None):
    if root:
        yield from post_order(root.left)
        yield from post_order(root.right)
        yield root.val

tree = TreeNode(2, TreeNode(1), TreeNode(3))
print("In-order:  ", list(in_order(tree)))   # [1, 2, 3] (sorted!)
print("Pre-order: ", list(pre_order(tree)))  # [2, 1, 3]
print("Post-order:", list(post_order(tree))) # [1, 3, 2]
```

## Go deeper

A binary tree can be uniquely reconstructed from its **pre-order and in-order** traversals, or from its **post-order and in-order** traversals. 

However, a tree cannot be uniquely reconstructed from pre-order and post-order traversals alone because without in-order information, one cannot distinguish whether a single child is a left or right child.

From an algorithmic engineering perspective, understanding the precise operational characteristics of binary tree traversal orders allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- In-order traversal only yields sorted keys if the tree satisfies the BST property.
- Traversing deep trees recursively consumes O(h) call stack memory.

## Remember

- In-order (Left-Node-Right) yields sorted keys in a BST.
- Pre-order (Node-Left-Right) is used for cloning and serialization.
- Post-order (Left-Right-Node) is used for bottom-up cleanup and evaluation.
