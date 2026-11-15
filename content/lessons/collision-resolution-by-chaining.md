---
slug: collision-resolution-by-chaining
title: "Collision Resolution by Chaining"
topic: stacks-queues-and-hash-tables
kind: technique
summary: "Separate chaining stores colliding keys in linked lists or secondary structures at the hashed bucket index."
tags: ["chaining", "collisions", "hash-table", "data-structures"]
related: ["hash-function-principles", "open-addressing-and-probing", "load-factor-and-dynamic-rehashing"]
---
> **In one line:** Chaining stores colliding keys in a linked list or secondary bucket at each table index.

## The idea

When two distinct keys produce the same bucket index ($h(k_1) \equiv h(k_2) \pmod m$), a **hash collision** occurs.

In **separate chaining**, each slot in the table array points to a secondary data structure (traditionally a singly linked list) holding all key-value entries assigned to that bucket.

```flow
b0: Bucket 0 | [None] @neutral
b1: Bucket 1 | (key1, v1) -> (key2, v2) @primary
b2: Bucket 2 | [None] @neutral
b3: Bucket 3 | (key3, v3) @green
b1 -> b3: hash modulo mapping
```

- **Insertion:** Prepend the new key-value pair to the linked list at `table[h(k)]` in $O(1)$ time.
- **Search / Deletion:** Scan the linked list at `table[h(k)]` sequentially, comparing keys using equality.

## See it

Implementing a minimal hash table with separate chaining:

```python
class ChainedHashTable:
    def __init__(self, size: int = 8):
        self.size = size
        self.buckets: list[list[tuple[str, int]]] = [[] for _ in range(size)]

    def _hash(self, key: str) -> int:
        return abs(hash(key)) % self.size

    def insert(self, key: str, val: int) -> None:
        b_idx = self._hash(key)
        bucket = self.buckets[b_idx]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, val)  # Update existing
                return
        bucket.append((key, val))  # Collision appended to chain

    def get(self, key: str) -> int | None:
        b_idx = self._hash(key)
        for k, v in self.buckets[b_idx]:
            if k == key:
                return v
        return None
```

## Go deeper

Under the assumption of **simple uniform hashing**, any given key is equally likely to hash into any of the $m$ buckets, independently of where other keys hash.

If $n$ keys are distributed across $m$ buckets, the average chain length is the **load factor** $\alpha = n / m$. The average time for a search is $\Theta(1 + \alpha)$. If $m$ scales proportionally to $n$ ($m = \Omega(n)$), then $\alpha = O(1)$, guaranteeing average $O(1)$ operations.

From an algorithmic engineering perspective, understanding the precise operational characteristics of collision resolution by chaining allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- In the pathological worst case where all keys hash to the same bucket, chaining degrades to an O(n) linked list.
- Java 8+ mitigates worst-case collisions by converting long chains (> 8 items) into balanced Red-Black trees.

## Remember

- Separate chaining resolves collisions via secondary lists at each table slot.
- Average search time is Theta(1 + alpha), where alpha = n / m is the load factor.
- Preserves O(1) average time as long as the table capacity grows proportionally with element count.
