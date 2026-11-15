---
slug: load-factor-and-dynamic-rehashing
title: "Load Factor and Rehashing"
topic: stacks-queues-and-hash-tables
kind: concept
summary: "The load factor alpha = n / m measures table occupancy; exceeding threshold triggers doubling and full rehashing."
tags: ["load-factor", "rehashing", "resizing", "hash-table"]
related: ["hash-function-principles", "open-addressing-and-probing", "hash-table-worst-case-pitfalls"]
---
> **In one line:** The load factor alpha = n / m dictates collision rates; exceeding threshold triggers dynamic table doubling.

## The idea

The performance of any hash table is governed by its **load factor** $\alpha$, defined as the ratio of stored elements $n$ to total bucket capacity $m$:

$$\alpha = \frac{n}{m}$$

As $\alpha$ increases, collisions multiply exponentially. When $\alpha$ approaches $1.0$ in open addressing, probe sequences become intolerably long, causing lookups to stall.

| Data Structure | Typical Threshold ($\alpha_{\max}$) | Action When Exceeded |
|---|---|---|
| **Separate Chaining** | $0.75 - 1.0$ | Double array capacity; rehash all entries. |
| **Open Addressing** | $0.66 - 0.70$ | Double array capacity; rehash all entries. |
| **Python dict** | $\approx 0.66$ (2/3 full) | Reallocates and builds compact index array. |

To maintain average $O(1)$ operations, hash tables dynamically **rehash**: allocating a new array (typically double the size) and re-inserting all existing keys.

## See it

Dynamic resizing and rehashing logic:

```python
class ResizingHashTable:
    def __init__(self, capacity: int = 4):
        self.cap = capacity
        self.count = 0
        self.buckets = [[] for _ in range(capacity)]

    def insert(self, key: str, val: int) -> None:
        if (self.count + 1) / self.cap > 0.75:
            self._rehash(self.cap * 2)
            
        idx = abs(hash(key)) % self.cap
        self.buckets[idx].append((key, val))
        self.count += 1

    def _rehash(self, new_cap: int) -> None:
        old_buckets = self.buckets
        self.cap = new_cap
        self.buckets = [[] for _ in range(new_cap)]
        self.count = 0
        for bucket in old_buckets:
            for k, v in bucket:
                self.insert(k, v)
```

## Go deeper

Notice that during rehashing, bucket indices cannot simply be copied over:
$$\text{new\_index} = h(k) \bmod m_{\text{new}}$$
Because the modulo denominator changed from $m$ to $2m$, keys hash to completely different bucket positions.

While a rehashing event takes $O(n)$ time to reinsert all elements, geometric capacity doubling guarantees that rehashing occurs exponentially less often, maintaining an **amortized cost of $O(1)$** per insertion.

From an algorithmic engineering perspective, understanding the precise operational characteristics of load factor and rehashing allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- Rehashing takes O(n) time and can introduce latency spikes in real-time trading or robotics applications.
- You cannot preserve old bucket indices during resizing; every key must be re-evaluated with the new modulo.

## Remember

- The load factor alpha = n / m measures table occupancy density.
- Exceeding threshold (typically 0.7) triggers capacity doubling and full rehashing.
- Amortized cost per insertion remains O(1) despite periodic O(n) resize operations.
