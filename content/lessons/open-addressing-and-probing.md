---
slug: open-addressing-and-probing
title: "Open Addressing and Probing"
topic: stacks-queues-and-hash-tables
kind: technique
summary: "Open addressing resolves collisions by probing alternative vacant slots within the primary table array."
tags: ["open-addressing", "probing", "hash-table", "tombstones"]
related: ["hash-function-principles", "collision-resolution-by-chaining", "load-factor-and-dynamic-rehashing"]
---
> **In one line:** Open addressing stores all entries directly within the primary array, probing alternative slots on collision.

## The idea

Unlike separate chaining, **open addressing** stores all key-value entries directly within the primary table array. No secondary lists or pointers are used.

If slot $h(k)$ is occupied, the algorithm calculates a deterministic sequence of alternative slots called a **probe sequence**:

1. **Linear Probing:** $h(k, i) = (h(k) + i) \pmod m$. Inspects consecutive slots. Suffers from *primary clustering* (long runs of occupied slots forming).
2. **Quadratic Probing:** $h(k, i) = (h(k) + c_1 i + c_2 i^2) \pmod m$. Reduces primary clustering.
3. **Double Hashing:** $h(k, i) = (h_1(k) + i \cdot h_2(k)) \pmod m$. Best distribution; step size depends on key.

| Probing Scheme | Formula | Advantage | Disadvantage |
|---|---|---|---|
| **Linear** | $(h + i) \pmod m$ | Superb CPU cache locality | Primary clustering |
| **Quadratic** | $(h + c_1 i + c_2 i^2) \pmod m$ | Avoids primary clusters | Secondary clustering |
| **Double Hashing**| $(h_1 + i \cdot h_2) \pmod m$ | Uniform distribution | Requires two hash computations |

Python's `dict` uses an optimized open addressing scheme with perturbational probing.

## See it

Open addressing with linear probing and deletion tombstones:

```python
class LinearProbingMap:
    TOMBSTONE = object()  # Marker for deleted slots

    def __init__(self, capacity: int = 8):
        self.cap = capacity
        self.keys = [None] * capacity
        self.vals = [None] * capacity

    def put(self, key: str, val: int) -> None:
        idx = abs(hash(key)) % self.cap
        while self.keys[idx] is not None and self.keys[idx] is not self.TOMBSTONE:
            if self.keys[idx] == key:
                self.vals[idx] = val
                return
            idx = (idx + 1) % self.cap
        self.keys[idx] = key
        self.vals[idx] = val
```

## Go deeper

Deleting an entry in open addressing presents a critical challenge: if you simply set an occupied slot back to `None`, you break the probe sequence for subsequent keys that collided and probed past that slot!

To solve this, deleted slots are marked with a special sentinel called a **tombstone** (or dummy). Search operations continue probing past tombstones, whereas insert operations can overwrite tombstones with new entries.

From an algorithmic engineering perspective, understanding the precise operational characteristics of open addressing and probing allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- In open addressing, the load factor can never exceed 1.0; tables must resize well before becoming full.
- Simply clearing a deleted slot to None breaks subsequent probe chains, causing existing keys to become unfindable.

## Remember

- Open addressing stores all entries directly inside the primary table array.
- Linear probing offers excellent cache performance but creates clusters.
- Deletions require tombstone markers to preserve lookup probe chains.
