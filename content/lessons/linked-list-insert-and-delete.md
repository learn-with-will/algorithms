---
slug: linked-list-insert-and-delete
title: "Linked List Insertion and Deletion"
topic: linear-data-structures
kind: technique
summary: "Inserting or deleting a node takes O(1) pointer updates once the target predecessor node is already located."
tags: ["linked-list", "insertion", "deletion", "pointers"]
related: ["singly-linked-list-nodes", "sentinel-nodes-for-edge-cases", "reversing-a-linked-list"]
---
> **In one line:** Inserting or deleting a node requires only updating adjacent next pointers in O(1) time.

## The idea

The defining capability of linked lists is constant-time structural mutation. Once you possess a pointer to a node's predecessor, inserting or deleting requires modifying only pointer links:

- **Prepend (Insert at Head):** Set `new_node.next = head`, then update `head = new_node`. Takes $O(1)$ time with zero shifts.
- **Insert After Node $P$:** Set `new_node.next = P.next`, then update `P.next = new_node`. Takes $O(1)$ time.
- **Delete After Node $P$:** Set `P.next = P.next.next`. The bypassed node is decoupled in $O(1)$ time.

| Operation | Array Cost | Linked List (at node) | Linked List (by index) |
|---|---|---|---|
| **Insert at Head** | $O(n)$ shift | $O(1)$ pointer update | $O(1)$ |
| **Insert at Known Node** | $O(n)$ shift | $O(1)$ pointer update | $O(n)$ (traversal) |
| **Lookup by Index** | $O(1)$ offset | $O(n)$ traversal | $O(n)$ traversal |

Notice that finding the node by value still takes $O(n)$ linear traversal; the mutation itself is what takes $O(1)$.

## See it

Inserting and deleting nodes in a singly linked list:

```python
class ListNode:
    def __init__(self, val: int, next: 'ListNode | None' = None):
        self.val = val
        self.next = next

# Prepend: O(1) insertion at head
def push_front(head: ListNode | None, val: int) -> ListNode:
    return ListNode(val, head)

# Insert after existing node: O(1)
def insert_after(prev_node: ListNode, val: int) -> ListNode:
    new_node = ListNode(val, prev_node.next)
    prev_node.next = new_node
    return new_node

# Delete next node: O(1)
def delete_after(prev_node: ListNode) -> None:
    if prev_node.next is not None:
        prev_node.next = prev_node.next.next
```

## Go deeper

Deleting a specific target node in a singly linked list requires holding a reference to its **predecessor**. If you only hold a pointer to the target node itself, you cannot re-link the previous node's `next` pointer forward.

A classic interview trick copies the value of `target.next` into `target` and deletes `target.next`, but this fails if the target is the tail node. For bidirectional navigation and symmetric deletion, doubly linked lists are required.

From an algorithmic engineering perspective, understanding the precise operational characteristics of linked list insertion and deletion allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Order of pointer assignments matters: when inserting, assign new_node.next before updating prev.next, or you overwrite the chain.
- Always check that prev_node.next is not None before attempting to access prev_node.next.next.

## Remember

- Inserting or removing nodes takes O(1) pointer operations given the predecessor node.
- Inserting at the head is always O(1) and requires no predecessor traversal.
- Assign new_node.next first to avoid severing and losing the remainder of the list.
