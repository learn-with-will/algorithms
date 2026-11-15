---
slug: monotonic-stack-technique
title: "The Monotonic Stack Technique"
topic: stacks-queues-and-hash-tables
kind: technique
summary: "Maintain elements in strictly increasing or decreasing order to solve next-greater-element problems in O(n) time."
tags: ["monotonic-stack", "patterns", "optimization", "linear-time"]
related: ["lifo-stack-operations", "balanced-brackets-with-stacks", "collections-deque-vs-list-pop0"]
---
> **In one line:** A monotonic stack maintains elements in sorted order to identify next greater or smaller items in O(n) time.

## The idea

A **monotonic stack** is a standard stack that enforces an invariant: its elements are strictly sorted (monotonically increasing or decreasing) from bottom to top.

When pushing a new item, any items on the stack that violate the monotonic invariant are popped off first. This pattern is ideally suited for problems requiring finding the **next greater element**, **previous smaller element**, or largest rectangle in a histogram.

> **Note:** Although a single element can trigger multiple pops, **every element is pushed and popped at most once**, guaranteeing an overall running time of $O(n)$ across the entire sequence.

## See it

Finding the next greater element for each item in an array:

```python
def next_greater_elements(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    # Monotonic decreasing stack storing indices
    stack = []
    
    for i in range(n):
        # Pop elements smaller than current number
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
        
    return result

data = [2, 1, 2, 4, 3]
print(next_greater_elements(data))  # Output: [4, 2, 4, -1, -1]
```

## Go deeper

Why does the monotonic stack eliminate nested quadratic searching?

Consider what happens to element $A[j]$ when popped by $A[i]$: because $A[i] > A[j]$, $A[i]$ is guaranteed to be the *first* larger value appearing to the right of index $j$. Any smaller items popped before it could not possibly be the next greater element for subsequent items.

Storing **indices** on the stack rather than raw values allows retrieving both distance offsets ($i - j$) and values simultaneously, enabling constant-time geometric calculations like the Daily Temperatures or Largest Rectangle in Histogram problems.

From an algorithmic engineering perspective, understanding the precise operational characteristics of the monotonic stack technique allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Store indices on the stack rather than values when distance calculations between elements are required.
- Check for strict vs non-strict inequalities (< vs <=) depending on duplicate handling requirements.

## Remember

- Monotonic stacks maintain elements in strictly ascending or descending order.
- Solves next/previous greater/smaller element queries in amortized O(n) time.
- Each element is pushed once and popped at most once across the entire scan.
