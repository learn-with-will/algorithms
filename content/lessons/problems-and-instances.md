---
slug: problems-and-instances
title: "Problems Versus Instances"
topic: algorithmic-foundations
kind: concept
summary: "A computational problem defines a general input-output relationship, while an instance is one specific concrete input."
tags: ["problem-solving", "instances", "specifications", "correctness"]
related: ["what-is-an-algorithm", "pseudocode-and-specification", "guarding-preconditions"]
---
> **In one line:** A problem specifies the general requirements, whereas an instance is a single concrete input dataset.

## The idea

A fundamental distinction in computer science exists between a **computational problem** and an **instance** of that problem:

1. **Computational Problem:** The abstract specification of an input-output relationship across an infinite domain of potential inputs. For example, the *sorting problem* states: given an arbitrary sequence of $n$ numbers $\langle a_1, a_2, \dots, a_n \rangle$, find a permutation $\langle a'_1, a'_2, \dots, a'_n \rangle$ such that $a'_1 \le a'_2 \le \dots \le a'_n$.
2. **Problem Instance:** A specific, concrete set of input values satisfying the problem constraints. For instance, the list $\langle 31, 41, 59, 26, 41, 58 \rangle$ is a single concrete instance of the sorting problem.

> **Note:** An algorithm solves a computational problem if and only if it produces the correct output for **every** valid instance of that problem, including boundary edge cases.

A program that succeeds on common test cases but fails on empty arrays, identical duplicates, or negative values does not solve the problem.

## See it

Checking whether an implementation solves a problem across varied instances:

```python
def is_sorted(seq: list[int]) -> bool:
    """Validates whether a sequence is non-decreasing."""
    for i in range(len(seq) - 1):
        if seq[i] > seq[i + 1]:
            return False
    return True

# Testing varied instances of the sorting verification problem:
print(is_sorted([1, 2, 2, 5]))    # True (typical instance)
print(is_sorted([]))              # True (empty instance boundary case)
print(is_sorted([42]))            # True (single-element instance)
print(is_sorted([5, 3, 9]))       # False (unsorted instance)
```

## Go deeper

Instance size ($n$) dictates algorithmic cost. In sorting, $n$ represents the element count; in graph algorithms, size is characterized by vertex count $|V|$ and edge count $|E|$; in integer arithmetic, size is measured in the total number of binary bits required to encode the numbers.

When analyzing algorithms mathematically, theorems must hold across the infinite universe of all valid instances. In contrast, software test suites merely sample a finite subset of instances. 

A formal proof of correctness requires showing that no adversarial instance exists that causes the algorithm to produce erroneous output, loop indefinitely, or violate memory bounds.

From an algorithmic engineering perspective, understanding the precise operational characteristics of problems versus instances allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Passing all unit test cases does not prove an algorithm correct; it only proves correctness on those specific instances.
- Edge instances like empty sequences, duplicated keys, or negative numbers must be explicitly analyzed.

## Remember

- A problem defines the general mathematical input-output contract.
- An instance is a specific, concrete input provided to solve.
- An algorithm is only correct if it terminates and succeeds for every valid instance.
