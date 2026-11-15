---
slug: reversing-a-linked-list
title: "In-Place Linked List Reversal"
topic: linear-data-structures
kind: technique
summary: "Reverse linked list pointer directions in a single O(n) pass using three pointers: prev, curr, and next."
tags: ["linked-list", "reversal", "in-place", "pointers"]
related: ["singly-linked-list-nodes", "linked-list-insert-and-delete", "sentinel-nodes-for-edge-cases"]
---
> **In one line:** Reverse a linked list in-place in O(n) time and O(1) space using three pointers.

## The idea

Reversing a singly linked list in-place is one of the classic algorithmic interview problems. The task requires redirecting every node's `next` pointer backward without allocating new node copies.

The canonical iterative algorithm maintains **three sliding pointers**:
1. `prev`: points to the already reversed prefix (initially `None`).
2. `curr`: the node currently being redirected.
3. `next_temp`: temporarily stores `curr.next` before the forward link is severed.

```flow
p1: prev | reversed prefix @amber
p2: curr | node being redirected @primary
p3: next_temp | saved forward chain @blue
p2 -> p1: redirect pointer
p3 -> p2: advance pointer
```

Each iteration takes $O(1)$ operations, reversing the entire list of $n$ nodes in $O(n)$ time and $O(1)$ auxiliary space.

## See it

Iterative in-place linked list reversal:

```python
class ListNode:
    def __init__(self, val: int, next: 'ListNode | None' = None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode | None) -> ListNode | None:
    prev = None
    curr = head
    
    while curr is not None:
        next_temp = curr.next  # 1. Save forward pointer
        curr.next = prev       # 2. Reverse link direction
        prev = curr            # 3. Advance prev
        curr = next_temp       # 4. Advance curr
        
    return prev  # New head of reversed list

# Test list: 1 -> 2 -> 3 -> None
h = ListNode(1, ListNode(2, ListNode(3, None)))
rev = reverse_list(h)
print(rev.val, rev.next.val, rev.next.next.val)  # Output: 3 2 1
```

## Go deeper

Reversal can also be implemented recursively:
```python
def reverse_recursive(head: ListNode | None) -> ListNode | None:
    if head is None or head.next is None:
        return head
    new_head = reverse_recursive(head.next)
    head.next.next = head
    head.next = None
    return new_head
```
While mathematically elegant, the recursive approach requires $O(n)$ auxiliary call stack space, risking `RecursionError` on large lists. The iterative three-pointer technique is strictly preferred in production for its constant $O(1)$ auxiliary memory guarantee.

From an algorithmic engineering perspective, understanding the precise operational characteristics of in-place linked list reversal allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Severing curr.next before storing it in next_temp loses the remainder of the linked list permanently.
- Remember that the new head of the reversed list is prev, because curr evaluates to None at loop termination.

## Remember

- Iterative reversal uses three sliding pointers: prev, curr, and next_temp.
- Operates in O(n) linear time with O(1) auxiliary space.
- Always save the forward link before reassigning curr.next backward.
