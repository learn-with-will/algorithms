---
slug: singly-linked-list-nodes
title: "Singly Linked List Nodes and Pointers"
topic: linear-data-structures
kind: concept
summary: "Linked lists store disjoint heap-allocated node objects connected by explicit forward reference pointers."
tags: ["linked-list", "nodes", "pointers", "data-structures"]
related: ["contiguous-memory-and-indexing", "linked-list-insert-and-delete", "doubly-linked-lists"]
---
> **In one line:** A singly linked list connects independent heap-allocated node objects via forward next pointers.

## The idea

A **singly linked list** organizes elements linearly using independent heap-allocated **nodes**. Unlike arrays, nodes do not reside in contiguous memory; they can be scattered arbitrarily across the heap.

Each node contains two fields:
1. **Data payload:** The value or object reference being stored.
2. **Next pointer:** A reference to the subsequent node in the sequence (or `None` for the terminal tail node).

```flow
head: Head Reference | points to node 1 @primary
n1: Node(10) | value & next @blue
n2: Node(20) | value & next @blue
n3: Node(30) | next = None @green
head -> n1
n1 -> n2
n2 -> n3
```

Because nodes are non-contiguous, accessing the $k$-th element requires sequentially traversing $k$ pointer hops from the head, taking $O(k)$ time.

## See it

Building a minimal singly linked list from scratch:

```python
class ListNode:
    def __init__(self, val: int = 0, next: 'ListNode | None' = None):
        self.val = val
        self.next = next

# Constructing list: 10 -> 20 -> 30 -> None
node3 = ListNode(30)
node2 = ListNode(20, node3)
head = ListNode(10, node2)

# Sequential traversal:
curr = head
while curr is not None:
    print(curr.val, end=" -> ")
    curr = curr.next
print("None")  # Output: 10 -> 20 -> 30 -> None
```

## Go deeper

Linked lists represent a fundamental trade-off against arrays:

- **Advantage:** Insertion or deletion at a known position requires only updating pointer references ($O(1)$) with zero element shifting.
- **Disadvantage:** Random access by index is impossible ($O(n)$ search), and pointer storage adds significant memory overhead (an extra pointer per node).
- **Cache performance:** Because nodes are scattered across memory addresses, following `next` pointers triggers frequent CPU cache misses, making traversal much slower than array scanning.

From an algorithmic engineering perspective, understanding the precise operational characteristics of singly linked list nodes and pointers allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Losing the head reference of a linked list causes the entire list to become orphaned and garbage collected.
- Traversing past the end of a list without a while curr is not None guard raises AttributeError: 'NoneType' object has no attribute 'next'.

## Remember

- Linked lists store elements in disjoint heap nodes linked by pointer references.
- Random access takes O(n) traversal; there is no O(1) index arithmetic.
- Pointer storage overhead and CPU cache misses are the primary costs of linked structures.
