---
slug: what-is-an-algorithm
title: "What Is an Algorithm?"
topic: algorithmic-foundations
kind: concept
summary: "An algorithm is a well-defined sequence of computational steps that transforms valid inputs into specified outputs."
tags: ["algorithms", "foundations", "correctness", "specifications"]
related: ["problems-and-instances", "pseudocode-and-specification", "correctness-and-loop-invariants"]
---
> **In one line:** An algorithm is a finite, unambiguous procedure that takes input and computes a well-defined output.

## The idea

An **algorithm** is a precise computational procedure that takes some value, or set of values, as **input** and produces some value, or set of values, as **output**. It defines an exact sequence of operational steps required to solve a computational problem systematically.

In classical computer science, Donald Knuth formulated five fundamental criteria that every computational procedure must satisfy to be classified as an algorithm:

| Property | Meaning | Requirement |
|---|---|---|
| **Finiteness** | The procedure must always terminate | It must stop after a finite number of discrete execution steps. |
| **Definiteness** | Every step must be rigorously defined | Actions must be completely unambiguous and precisely specified. |
| **Input** | Initial data provided | Zero or more inputs drawn from a clearly specified mathematical set. |
| **Output** | Result computed | One or more quantities having a specified relationship to the inputs. |
| **Effectiveness** | Operations must be feasible | Every operation must be sufficiently basic that it can be carried out exactly. |

Notice what is absent from this definition: choice of programming language, processor architecture, clock speed, or formatting style. Algorithms are mathematical objects independent of any execution environment. A procedure that loops indefinitely fails finiteness and is merely a computational process, not an algorithm.

## See it

A function calculating the greatest common divisor using Euclid's algorithm:

```python
def gcd(a: int, b: int) -> int:
    """Compute greatest common divisor using Euclid's algorithm."""
    if a < 0 or b < 0:
        raise ValueError("Inputs must be non-negative integers")
    while b != 0:
        a, b = b, a % b
    return a

print(gcd(48, 18))  # Output: 6
print(gcd(101, 10))  # Output: 1
```

## Go deeper

Euclid's algorithm, first published around 300 BCE in Euclid's *Elements*, represents one of the oldest non-trivial algorithms still in active use. Its correctness relies on the algebraic fact that $\gcd(a, b) = \gcd(b, a \bmod b)$. 

Termination is guaranteed because the remainder $a \bmod b$ is strictly less than $b$ for positive integers. This establishes a strictly decreasing sequence of non-negative integers:
$$b_0 > b_1 > b_2 > \dots \ge 0$$
Because a strictly decreasing sequence of non-negative integers cannot be infinite, the algorithm must terminate in a finite number of steps.

Distinguishing algorithms from heuristic procedures is vital in systems engineering: an algorithm guarantees the correct result on all valid inputs, whereas a heuristic provides an approximate or likely solution without a formal proof of correctness or termination.

## Watch out

- Do not confuse an algorithm with its implementation in a specific programming language like Python or C.
- A procedure that runs indefinitely on valid inputs is not an algorithm; it fails the finiteness criterion.

## Remember

- An algorithm is a finite, definite sequence of computational steps transforming input to output.
- Knuth's criteria require finiteness, definiteness, input, output, and effectiveness.
- Algorithms are mathematical abstractions independent of programming syntax or hardware platforms.
