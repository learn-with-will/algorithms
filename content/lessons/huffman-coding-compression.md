---
slug: huffman-coding-compression
title: "Huffman Coding and Prefix Trees"
topic: greedy-and-backtracking
kind: pattern
summary: "Construct optimal prefix-free variable-length character encodings using a min-heap to greedily merge lowest frequencies."
tags: ["huffman-coding", "compression", "prefix-tree", "greedy"]
related: ["greedy-choice-property", "binary-heap-properties", "heapsort-and-heapq-module"]
---
> **In one line:** Huffman coding assigns shorter binary codes to frequent characters by greedily merging lowest-frequency tree nodes.

## The idea

**Huffman Coding** is an elegant greedy algorithm for lossless data compression. 

Standard fixed-length encodings (like ASCII) assign 8 bits to every character. Huffman coding assigns **variable-length binary codes**: characters that appear frequently receive short codes (e.g. 1 or 2 bits), while rare characters receive longer codes.

To prevent ambiguity when decoding, codes must be **prefix-free**: no character's code is a prefix of any other code.

Greedy algorithm using a min-heap:
1. Create a leaf node for each character with its frequency and push to a min-heap.
2. While the heap has more than one node:
   - Pop the two nodes with the **lowest frequencies** $L$ and $R$.
   - Create a parent node with frequency $L.\text{freq} + R.\text{freq}$, with $L$ and $R$ as children.
   - Push the parent back to the min-heap.
3. The remaining node is the root of the optimal prefix tree!

## See it

Constructing Huffman prefix codes in Python:

```python
import heapq

def build_huffman_codes(freqs: dict[str, int]) -> dict[str, str]:
    pq = [(f, c) for c, f in freqs.items()]
    heapq.heapify(pq)
    while len(pq) > 1:
        f1, n1 = heapq.heappop(pq)
        f2, n2 = heapq.heappop(pq)
        heapq.heappush(pq, (f1 + f2, (n1, n2)))
    codes = {}
    def walk(node, prefix=""):
        if isinstance(node, str):
            codes[node] = prefix
        else:
            walk(node[0], prefix + "0")
            walk(node[1], prefix + "1")
    walk(pq[0][1])
    return codes

freqs = {'a': 45, 'b': 13, 'c': 12, 'd': 16, 'e': 9, 'f': 5}
print(build_huffman_codes(freqs))  # 'a' gets shortest code '0'!
```

## Go deeper

> **Tip:** Always verify edge cases and boundary conditions (empty inputs, single elements, and extrema) before deploying algorithmic routines to production.

David Huffman developed this algorithm in 1952 as a term paper at MIT. 

Huffman coding produces the mathematically optimal symbol-by-symbol prefix code, achieving an average length bounded by the **Shannon entropy** of the source alphabet:
$$H(X) = -\sum p_i \log_2 p_i$$
It forms the entropy-encoding engine inside the DEFLATE algorithm (used in GZIP, PNG, and ZIP files).

From an algorithmic engineering perspective, understanding the precise operational characteristics of huffman coding and prefix trees allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- A prefix code cannot have any ambiguity; the prefix-free property is what enables stream decoding without delimiters.
- Single-character alphabets require special handling (assigning at least a 1-bit code '0').

## Remember

- Assigns shorter binary codes to more frequent characters.
- Greedily merges the two lowest-frequency subtrees using a min-heap.
- Forms the core entropy compression step in GZIP, PNG, and JPEG.
