---
slug: doubly-linked-lists
title: "Doubly Linked Lists"
topic: linear-data-structures
kind: concept
summary: "Doubly linked nodes maintain both next and prev pointers, enabling symmetrical O(1) node deletion."
tags: ["doubly-linked-list", "pointers", "bidirectional", "data-structures"]
related: ["singly-linked-list-nodes", "linked-list-insert-and-delete", "sentinel-nodes-for-edge-cases"]
---
> **In one line:** Doubly linked lists store both next and prev pointers, enabling O(1) deletion directly from a node reference.

## The idea

A **doubly linked list** enhances each node with two pointer references:
1. `next`: points to the subsequent node in the sequence.
2. `prev`: points to the preceding node in the sequence.

```flow
n1: Node A | head node @blue
n2: Node B | middle node @primary
n3: Node C | tail node @green
n1 -> n2: next pointer
n2 -> n3: next pointer
```

This bidirectional connectivity solves the primary limitation of singly linked lists: a node can unlink itself from the list in $O(1)$ time without traversing from the head to locate its predecessor:
```python
node.prev.next = node.next
node.next.prev = node.prev
```

## See it

Implementation of self-unlinking in a doubly linked list:

```python
class DoublyNode:
    def __init__(self, val: int):
        self.val = val
        self.prev: 'DoublyNode | None' = None
        self.next: 'DoublyNode | None' = None

    def unlink(self) -> None:
        """Remove self from list in O(1) time."""
        if self.prev:
            self.prev.next = self.next
        if self.next:
            self.next.prev = self.prev
        self.prev = None
        self.next = None

a = DoublyNode(10)
b = DoublyNode(20)
c = DoublyNode(30)
a.next, b.prev = b, a
b.next, c.prev = c, b

b.unlink()  # Removes B in O(1)
print(a.next.val)  # 30 (A now links directly to C)
```

## Go deeper

Doubly linked lists power critical production data structures:
- **LRU (Least Recently Used) Caches:** Combine a hash map with a doubly linked list to achieve $O(1)$ key lookup alongside $O(1)$ eviction and re-ordering.
- **Operating System Schedulers:** Manage process run queues where tasks are frequently inserted and removed dynamically.

The cost is memory: every node stores two 64-bit pointers (16 bytes) in addition to object headers and data payloads.

From an algorithmic engineering perspective, understanding the precise operational characteristics of doubly linked lists allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Every structural mutation in a doubly linked list requires updating four pointers instead of two.
- Failing to update both next and prev pointers leaves the list in an inconsistent corrupted state.

## Remember

- Doubly linked nodes maintain bidirectional next and prev pointers.
- Enables O(1) node deletion given a direct reference to the node itself.
- Forms the structural foundation of LRU caches and task scheduling queues.
