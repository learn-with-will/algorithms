---
slug: binary-search-algorithm
title: "Binary Search on Sorted Arrays"
topic: recursion-and-searching
kind: technique
summary: "Binary search repeatedly halves the search interval on sorted data, finding targets in O(log n) time."
tags: ["binary-search", "logarithmic", "searching", "algorithms"]
related: ["linear-search-and-sentinel-search", "binary-search-off-by-one-traps", "python-bisect-module"]
---
> **In one line:** Binary search halves the search space on each comparison, locating keys in sorted arrays in O(log n) time.

## The idea

When data is already sorted, we can do exponentially better than linear search. **Binary search** compares the target key against the median element of the current search interval:

- If target equals the midpoint element: search succeeds immediately.
- If target is smaller than the midpoint element: target must reside in the left half; discard the right half.
- If target is larger than the midpoint element: target must reside in the right half; discard the left half.

```flow
input: Sorted Array | bounds [low, high] @primary
mid: Calculate Midpoint | mid = (low + high) // 2 @blue
cmp: Compare arr[mid] == target? | check value @amber
narrow: Halve Interval | low = mid + 1 or high = mid - 1 @green
input -> mid
mid -> cmp
cmp -> narrow: No
```

Because each step discards half the remaining candidates ($n \to n/2 \to n/4 \to \dots \to 1$), the search terminates in at most $\lfloor \log_2 n \rfloor + 1$ iterations, taking **$O(\log n)$ time**.

## See it

Iterative implementation of binary search:

```python
def binary_search(arr: list[int], target: int) -> int:
    """Find target in sorted array in O(log n) time. Returns index or -1."""
    low, high = 0, len(arr) - 1
    
    while low <= high:
        # Prevents integer overflow in languages with fixed integer widths
        mid = low + (high - low) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1    # Discard left half
        else:
            high = mid - 1   # Discard right half
            
    return -1  # Target not found

sorted_nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print("Index of 23:", binary_search(sorted_nums, 23))  # Output: 5
print("Index of 50:", binary_search(sorted_nums, 50))  # Output: -1
```

## Go deeper

The scaling efficiency of $O(\log n)$ is astonishing:
- Searching $1,000$ items takes at most $10$ comparisons.
- Searching $1,000,000$ items takes at most $20$ comparisons.
- Searching $1,000,000,000$ items (one billion) takes at most $30$ comparisons!

Binary search demonstrates the immense power of preprocessing: spending $O(n \log n)$ time once to sort data pays massive dividends if multiple queries are executed subsequently.

From an algorithmic engineering perspective, understanding the precise operational characteristics of binary search on sorted arrays allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Binary search requires the input collection to be strictly sorted; running it on unsorted data yields completely wrong answers.
- Do not update bounds with low = mid or high = mid; that can trigger infinite loops when low and high are adjacent.

## Remember

- Binary search operates on sorted collections in O(log n) logarithmic time.
- Each comparison eliminates half of the remaining candidate interval.
- Always update bounds with low = mid + 1 and high = mid - 1.
