---
slug: binary-search-off-by-one-traps
title: "Binary Search Off-by-One Traps"
topic: recursion-and-searching
kind: pitfall
summary: "Avoid infinite loops and missing elements by carefully aligning loop conditions, mid arithmetic, and bounds updates."
tags: ["binary-search", "off-by-one", "pitfalls", "debugging"]
related: ["binary-search-algorithm", "python-bisect-module", "binary-search-on-answer-spaces"]
---
> **In one line:** Binary search is notoriously prone to off-by-one bugs: align loop conditions, midpoint calculations, and updates.

## The idea

Despite its conceptual simplicity, Donald Knuth noted that while the first binary search was published in 1946, the first completely bug-free binary search did not appear until 1962.

Subtle bugs manifest across three critical areas:

1. **Loop Condition (`low <= high` vs `low < high`):** If using inclusive bounds `[low, high]`, the condition must be `low <= high` to examine single-element sub-arrays (`low == high`).
2. **Integer Midpoint Overflow:** In languages like Java or C++, `(low + high) / 2` overflows positive 32-bit integers when $low + high > 2^{31}-1$. Use `low + (high - low) // 2`.
3. **Boundary Updates:** If updating `low = mid` instead of `mid + 1`, a two-element array where `low = 0, high = 1` yields `mid = 0`, locking the algorithm into an **infinite loop**.

## See it

Comparing buggy boundary updates with correct logic:

```python
# Buggy implementation: risks infinite loop on two-element arrays!
def buggy_binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low < high:  # BUG 1: misses single-element matches!
        mid = (low + high) // 2
        if arr[mid] < target:
            low = mid   # BUG 2: infinite loop when low + 1 == high!
        else:
            high = mid
    return low if arr and arr[low] == target else -1

# Correct canonical implementation
def correct_binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

A helpful mental model is verifying the **invariants of the search range**:
- In the inclusive range model `[low, high]`: the target is guaranteed to be in `arr[low..high]` if it exists at all. When `arr[mid] != target`, `mid` is excluded, dictating `low = mid + 1` or `high = mid - 1`.
- In the half-open range model `[low, high)`: the target is in `arr[low..high)`. When `arr[mid] < target`, set `low = mid + 1`; when `arr[mid] >= target`, set `high = mid`.

From an algorithmic engineering perspective, understanding the precise operational characteristics of binary search off-by-one traps allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Never use low = mid with integer floor division; it causes infinite loops when high == low + 1.
- Verify behavior on arrays of length 0, 1, and 2 before finalizing binary search code.

## Remember

- Inclusive search intervals [low, high] require while low <= high.
- Midpoint arithmetic should use low + (high - low) // 2.
- Always step past the inspected midpoint: low = mid + 1 and high = mid - 1.
