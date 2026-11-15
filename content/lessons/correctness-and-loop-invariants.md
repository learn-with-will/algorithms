---
slug: correctness-and-loop-invariants
title: "Correctness and Loop Invariants"
topic: algorithmic-foundations
kind: technique
summary: "Prove iterative algorithm correctness using loop invariants: initialization, maintenance, and termination."
tags: ["correctness", "loop-invariant", "induction", "proofs"]
related: ["what-is-an-algorithm", "problems-and-instances", "loop-invariant-in-action"]
---
> **In one line:** A loop invariant is a formal predicate that remains true across every iteration to prove loop correctness.

## The idea

To prove that an iterative loop computes the right answer, computer scientists rely on a **loop invariant** — a formal statement that remains true before and after each iteration.

Reasoning with loop invariants mirrors mathematical induction across three indispensable phases:

| Phase | Induction Analogy | Requirement |
|---|---|---|
| **Initialization** | Base Case | The invariant must be true prior to the first iteration of the loop. |
| **Maintenance** | Inductive Step | If the invariant is true before an iteration, it remains true before the next. |
| **Termination** | Conclusion | When the loop terminates, the invariant provides the property proving correctness. |

> **Important:** A loop invariant does not prove termination by itself. You must separately demonstrate that the loop condition eventually evaluates to False and halts execution.

## See it

Finding the maximum value with an explicit loop invariant:

```python
def find_max(arr: list[int]) -> int:
    if not arr:
        raise ValueError("Cannot find maximum of empty array")
    # Invariant: largest is the maximum element in arr[0 : i]
    largest = arr[0]
    
    for i in range(1, len(arr)):
        # Maintenance: compare arr[i] with current maximum
        if arr[i] > largest:
            largest = arr[i]
        # Invariant re-established for arr[0 : i + 1]
        
    # Termination: i == len(arr), so largest is max of arr[0 : len(arr)]
    return largest

print(find_max([7, 2, 9, 4, 8]))  # Output: 9
```

## Go deeper

At termination, the invariant works in conjunction with the loop termination condition.

In `find_max`, the loop terminates when index $i = n$. The invariant asserts that `largest` equals $\max(arr[0 \dots i-1])$. Substituting $i = n$ yields `largest` $= \max(arr[0 \dots n-1])$, which directly establishes the correctness of the return value for the entire input array.

In formal verification systems like Hoare logic, loop invariants are combined with pre-conditions and post-conditions to construct automated proofs of software safety, guaranteeing that programs cannot enter invalid runtime states.

From an algorithmic engineering perspective, understanding the precise operational characteristics of correctness and loop invariants allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

## Watch out

- An invariant that holds during initialization but fails after an iteration is invalid.
- Remember that proving an invariant holds does not guarantee that the loop terminates.

## Remember

- Loop invariants prove loop correctness via initialization, maintenance, and termination.
- Maintenance demonstrates that the invariant holds iteratively from step k to k+1.
- Termination combines the final invariant state with the exit condition to prove the result.
