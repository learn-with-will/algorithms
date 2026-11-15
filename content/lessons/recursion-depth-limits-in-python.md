---
slug: recursion-depth-limits-in-python
title: "Recursion Depth Limits in Python"
topic: recursion-and-searching
kind: pitfall
summary: "CPython enforces a default maximum recursion limit of 1000 frames to prevent host stack buffer overflows."
tags: ["recursion-limit", "sys-module", "stack-overflow", "cpython"]
related: ["anatomy-of-a-recursive-function", "call-stack-and-activation-frames", "tail-recursion-and-iteration"]
---
> **In one line:** CPython enforces a default recursion limit of 1000 frames to prevent C stack segmentation faults.

## The idea

Unlike languages compiled directly to machine code where stack exhaustion triggers a hard operating system crash (Segmentation Fault), Python defends itself using a built-in safety mechanism.

The CPython interpreter maintains an internal frame counter. If the call depth reaches the maximum threshold (1000 by default), Python halts execution and raises:
`RecursionError: maximum recursion depth exceeded`

| Setting | Default Value | Purpose |
|---|---|---|
| `sys.getrecursionlimit()` | $1000$ | Prevents native C call stack overflows on the operating system. |
| `sys.setrecursionlimit(n)` | Configurable | Allows adjusting threshold for deeply recursive tree algorithms. |

While you can increase this limit using `sys.setrecursionlimit()`, doing so risks terminating the entire Python process if the host OS thread stack is exhausted.

## See it

Catching RecursionError and inspecting the interpreter limit:

```python
import sys

print("Current recursion limit:", sys.getrecursionlimit())

def recursive_counter(count: int) -> None:
    recursive_counter(count + 1)

try:
    recursive_counter(1)
except RecursionError as err:
    print(f"Caught expected error: {err}")
```

## Go deeper

Why does Python choose a relatively conservative default limit of 1000?

Every Python call frame requires allocating a C-level stack frame inside the interpreter's `_PyEval_EvalFrameDefault` function. On systems with standard thread stack allocations (typically 1MB to 8MB), exceeding a few thousand nested C calls can overrun the process memory boundary.

For linear sequences where $n$ can reach tens of thousands, recursive solutions are structurally inappropriate in Python; an iterative approach must be chosen instead.

From an algorithmic engineering perspective, understanding the precise operational characteristics of recursion depth limits in python allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Increasing sys.setrecursionlimit to extreme values (e.g. 100,000) can cause the Python process to abruptly crash without a traceback.
- Linear recursive algorithms will inevitably fail on moderately sized production datasets.

## Remember

- CPython limits recursion to 1000 calls by default to guard host stack memory.
- Exceeding the limit raises a catchable RecursionError.
- Prefer iteration over deep linear recursion when input sizes exceed hundreds of items.
