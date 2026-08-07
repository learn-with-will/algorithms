---
id: lesson-01
slug: algorithmic-thinking-and-correctness
title: "Algorithmic Thinking and Correctness"
level: beginner
order: 1
duration: 20
tags:
  - algorithms
  - correctness
  - loop-invariant
  - pseudocode
  - fundamentals
---

# Learning Objectives

By the end of this lesson you will be able to:

- Define what an **algorithm** is and list the properties every algorithm must have.
- Distinguish a *problem* from an *instance* of that problem.
- Describe an algorithm precisely in pseudocode and in Python.
- State what it means for an algorithm to be **correct**.
- Use a **loop invariant** to argue that a loop does what it claims.

# Why This Concept Exists

Before you can ask whether an algorithm is *fast*, you have to be sure it is
*right*. A program that returns the wrong answer quickly is worthless. Yet "right"
is slippery: right for which inputs? Including the empty list? A list with one
element? Duplicates?

Algorithmic thinking is the discipline of describing a computation precisely enough
that you can reason about it — prove it terminates, prove it produces the correct
output on *every* valid input, and only then measure how much time and space it
costs. This lesson gives you the vocabulary and the single most useful proof tool,
the loop invariant, that the rest of the course leans on.

# Concept Explanation

### What is an algorithm?

An **algorithm** is a well-defined computational procedure that takes some value,
or set of values, as **input** and produces some value, or set of values, as
**output**. It is a sequence of computational steps that transforms the input into
the output.

Donald Knuth's classic criteria say an algorithm must have five properties:

- **Finiteness** — it always terminates after a finite number of steps.
- **Definiteness** — each step is precisely, unambiguously defined.
- **Input** — zero or more inputs, drawn from a specified set.
- **Output** — one or more outputs with a specified relationship to the input.
- **Effectiveness** — each step is basic enough to be carried out exactly.

Notice what is *not* on the list: the programming language, how fast it runs, or how
elegant it looks. Those matter, but they are separate questions.

### Problems versus instances

A **problem** defines the input/output relationship in general terms. For example,
the *sorting problem* is: given a sequence of `n` numbers, produce a permutation of
that sequence in nondecreasing order.

An **instance** is one specific input. `[5, 2, 9, 2]` is an instance of the sorting
problem; the correct output for that instance is `[2, 2, 5, 9]`. An algorithm solves
the *problem* only if it produces the correct output for *every* instance.

### Describing an algorithm

We describe algorithms in **pseudocode** — a structured, language-neutral notation
that focuses on the logic — and then implement them in a real language. In this
course the implementation language is Python, which reads almost like pseudocode:

```text
FIND-MAX(A)                       # A is a non-empty list
  largest = A[0]
  for i = 1 to length(A) - 1
      if A[i] > largest
          largest = A[i]
  return largest
```

### Correctness

An algorithm is **correct** if, for every input instance, it halts (terminates) and
returns the correct output. An algorithm that gives the right answer on the inputs
you happened to try, but loops forever or returns garbage on some other valid input,
is *not* correct.

### Loop invariants

Most of the work in an algorithm happens inside loops, so we need a way to reason
about them. A **loop invariant** is a statement that is true before the loop starts
and stays true across every iteration. We use it exactly like induction, in three parts:

- **Initialization** — the invariant is true before the first iteration.
- **Maintenance** — if it is true before an iteration, it is still true before the next.
- **Termination** — when the loop ends, the invariant (plus the reason the loop
  ended) gives us the property we wanted to prove.

For `FIND-MAX`, a good invariant is: *at the start of each iteration, `largest` holds
the maximum value of `A[0..i-1]`.* Initialization: before the loop `largest = A[0]`,
the max of `A[0..0]`. Maintenance: each step updates `largest` if `A[i]` is bigger,
so it remains the max of the extended prefix. Termination: the loop ends with
`i = length(A)`, so `largest` is the max of the whole array — exactly what we return.

# Key Terminology

- **Algorithm** — a finite, well-defined procedure mapping inputs to outputs.
- **Problem** — the general specification of the input/output relationship.
- **Instance** — one concrete input to a problem.
- **Correct** — halts and returns the specified output for *every* valid input.
- **Pseudocode** — structured, language-independent description of an algorithm.
- **Loop invariant** — a property preserved before/after every loop iteration, used to prove correctness.
- **Precondition / Postcondition** — what is assumed true on entry / guaranteed true on exit.

# Complexity

We will quantify cost precisely in the next lesson. For the running example:

| Algorithm | Time | Space |
| --------- | ---- | ----- |
| `FIND-MAX` (one pass over `n` elements) | O(n) | O(1) |

It examines each element once and stores only a single running maximum, so time
grows linearly with the input size and the extra space is constant.

# Implementation in Python

```python
def find_max(a: list[int]) -> int:
    """Return the largest element of a non-empty list.

    Precondition:  len(a) >= 1
    Postcondition: returns max(a)
    """
    if not a:
        raise ValueError("find_max() arg is an empty list")

    largest = a[0]
    # Invariant: `largest` is the maximum of a[0 .. i-1].
    for i in range(1, len(a)):
        if a[i] > largest:
            largest = a[i]
    return largest
```

# Real World Analogy

An algorithm is a **recipe**. The ingredients are the input; the finished dish is the
output. A good recipe is *definite* ("bake at 180 °C for 25 minutes", not "bake until
it feels right"), *finite* (it ends), and *effective* (each step is something you can
actually do). Two cooks following the same recipe with the same ingredients should get
the same result — that determinism is exactly what makes an algorithm trustworthy.

# Examples

## Example 1 — Basic: summing a list

```python
def total(a: list[int]) -> int:
    s = 0
    # Invariant: s == sum of a[0 .. i-1].
    for i in range(len(a)):
        s += a[i]
    return s
```

**Why this is good:** the invariant makes correctness obvious. Initialization: before
the loop `s = 0`, the sum of the empty prefix. Maintenance: each step adds the next
element. Termination: after the last iteration `s` is the sum of the whole list. It
also handles the empty list correctly — it returns `0`, the sum of nothing.

## Example 2 — Real-world: linear search

```python
def index_of(a: list[int], target: int) -> int:
    """Return the index of `target` in `a`, or -1 if absent."""
    # Invariant: target is not in a[0 .. i-1].
    for i in range(len(a)):
        if a[i] == target:
            return i
    return -1
```

**Why this is good:** the invariant ("we have not yet seen `target`") explains why
returning `i` on a match is correct, and why falling out of the loop justifies
returning `-1`. The postcondition is precise about the "not found" case instead of
leaving it implicit.

## Example 3 — Best practice / edge case: guard your preconditions

```python
def average(a: list[float]) -> float:
    if not a:
        raise ValueError("average of empty sequence is undefined")
    return sum(a) / len(a)
```

```text
average([]) -> ValueError      (not a silent 0/0 crash deep inside the function)
average([4]) -> 4.0
```

**Why this is good:** correctness includes deciding what happens on the boundary
inputs. Here the empty list has no defined average, so we fail loudly and early
rather than raising an opaque `ZeroDivisionError` later. Python integers have
arbitrary precision, so summing large lists never overflows — one less edge case to
worry about than in C or Java.

# Common Mistakes

- **Confusing fast with correct.** Optimize only *after* the algorithm is provably
  right. A subtly wrong fast algorithm is worse than a correct slow one.
- **Testing only "nice" inputs.** Always consider the empty input, a single element,
  duplicates, already-sorted and reverse-sorted data, and the largest/smallest values.
- **Assuming an unstated precondition.** If your algorithm needs sorted input or a
  non-empty list, say so — and ideally check it.
- **Ignoring termination.** A loop whose invariant is fine can still run forever if the
  loop variable never reaches its bound. Correctness needs *finiteness* too.

# Best Practices

- Write the **precondition and postcondition** before the code; they define "correct".
- Pick a **loop invariant** for every non-trivial loop; if you cannot state one, you do
  not yet understand the loop.
- Test the **boundaries** first: empty, one element, all-equal, and extreme values.
- Keep the description **definite** — no "handle the rest appropriately" hand-waving.

# Summary

- An algorithm is a finite, definite, effective procedure from inputs to outputs.
- Solving a *problem* means being correct on *every instance*, not just the ones you tried.
- Correctness = it always terminates **and** always returns the specified output.
- A loop invariant proves a loop correct in three steps: initialization, maintenance,
  termination.
- Decide the behaviour on boundary inputs deliberately — that is part of being correct.

# Flash Cards

Q: What five properties must an algorithm have (Knuth)?
A: Finiteness, definiteness, input, output, and effectiveness.

Q: What is the difference between a problem and an instance?
A: A problem is the general input/output specification; an instance is one concrete input to it.

Q: What does it mean for an algorithm to be correct?
A: For every valid input it halts and produces the output the problem specifies.

Q: What are the three parts of a loop-invariant argument?
A: Initialization (true before the loop), maintenance (stays true each iteration), and termination (gives the result when the loop ends).

Q: Why check for the empty list at the start of find_max?
A: The maximum of an empty list is undefined, so it is a boundary input we must handle deliberately rather than crash on.

Q: Is "runs quickly" part of the definition of a correct algorithm?
A: No — speed is a separate concern; correctness is about always halting with the right output.

# Exercises

### Easy
Write `find_min(a)` with a stated loop invariant, and decide what it should do for an
empty list.

### Medium
Write `count_occurrences(a, target)` that returns how many times `target` appears.
State the loop invariant and verify it holds for `[]`, `[5]`, and `[5, 5, 5]`.

### Challenging
The `FIND-MAX` invariant assumes the list is non-empty. Rewrite it to return the max
of a possibly-empty list as an `Optional[int]` (returning `None` when empty), and
argue that your new version is correct on the empty input. Then explain why a loop
invariant alone is not enough to prove correctness — what else must you show?

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 1
  ("The Role of Algorithms in Computing") and Chapter 2 (loop invariants, insertion sort).
- Knuth, *The Art of Computer Programming*, Vol. 1 — Section 1.1 (the five properties of an algorithm).
- Python docs — [built-in `max`, `min`, `sum`](https://docs.python.org/3/library/functions.html)
  and the note that Python integers have unlimited precision.
