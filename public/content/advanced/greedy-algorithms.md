---
id: lesson-19
slug: greedy-algorithms
title: "Greedy Algorithms"
level: advanced
order: 19
duration: 30
tags:
  - greedy
  - activity-selection
  - huffman-coding
  - greedy-choice
  - optimization
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain the **greedy** strategy and the two properties that make it correct.
- Solve **activity selection** greedily and justify the earliest-finish-time rule.
- Describe **Huffman coding** as a greedy construction of an optimal prefix code.
- Explain why greedy solves **fractional** knapsack but fails on **0/1** knapsack.
- Recognize when to reach for greedy versus dynamic programming.

# Why This Concept Exists

Dynamic programming is powerful but can be expensive — it considers *every* choice. Sometimes
you do not have to: for certain problems, repeatedly making the **locally best** choice
provably yields the **globally best** solution. **Greedy algorithms** exploit that, and when
they apply they are simpler and faster than DP (often `O(n log n)` versus `O(n·W)`). The
catch, and the real skill, is knowing *when* greed is safe — because for many problems the
greedy choice is a trap. This lesson teaches both the technique and how to tell the two apart.

# Concept Explanation

### The greedy strategy and when it works

A **greedy algorithm** builds a solution step by step, always taking the option that looks
best *right now*, and never reconsidering. It is correct only when the problem has:

1. The **greedy-choice property** — a globally optimal solution can be reached by making a
   locally optimal (greedy) choice at each step. This is the crucial, problem-specific part
   that must be *proved*, usually by an "exchange argument".
2. **Optimal substructure** — after the greedy choice, what remains is a smaller instance of
   the same problem, solvable the same way.

Unlike DP, greedy commits to one choice and never revisits it — which is why it is fast, and
why it is wrong when a locally good choice blocks a better global solution.

### Activity selection

Given activities with start and finish times, select the **maximum number** of mutually
non-overlapping ones. The greedy rule: **sort by finish time**, then repeatedly take the next
activity whose start is ≥ the last chosen finish. Choosing the activity that finishes earliest
leaves the most room for the rest — the greedy choice, provably optimal. Sorting dominates, so
it is `O(n log n)`.

### Huffman coding

Huffman builds an optimal **prefix code** (no codeword is a prefix of another) for compressing
symbols by frequency. The greedy construction: put every symbol in a min-priority queue keyed
by frequency, then repeatedly **remove the two lowest-frequency nodes and merge them** into a
new node whose frequency is their sum, until one tree remains. Rarer symbols end up deeper
(longer codes), common symbols shallower — minimizing total encoded length. With a heap it is
`O(n log n)`, and the result is provably optimal.

### When greedy fails: 0/1 vs. fractional knapsack

- **Fractional knapsack** (you may take fractions of items): greedy by **value-to-weight
  ratio** — take the most valuable-per-kilogram first — is optimal.
- **0/1 knapsack** (each item all-or-nothing): the same greedy is **not** optimal; a
  high-ratio item can crowd out a better combination. 0/1 knapsack needs **dynamic
  programming** (Lesson 17).

The same-sounding problems have opposite answers — the sharpest reminder to verify the
greedy-choice property before trusting greed.

# Key Terminology

- **Greedy algorithm** — makes the locally optimal choice at each step, never backtracking.
- **Greedy-choice property** — a global optimum is reachable via locally optimal choices.
- **Exchange argument** — a proof technique swapping an optimal solution's choice for the
  greedy one without making it worse.
- **Prefix code** — a code where no codeword is a prefix of another (Huffman).
- **Optimal substructure** — the remaining problem after a choice is a smaller same-kind problem.

# Complexity

| Problem | Greedy approach | Time | Optimal? |
| ------- | --------------- | ---- | -------- |
| Activity selection | sort by finish time | O(n log n) | Yes |
| Huffman coding | merge two lowest freqs (heap) | O(n log n) | Yes |
| Fractional knapsack | sort by value/weight ratio | O(n log n) | Yes |
| 0/1 knapsack | greedy by ratio | O(n log n) | **No** — use DP `O(nW)` |

# Implementation in Python

```python
def activity_selection(activities: list[tuple[int, int]]) -> list[tuple[int, int]]:
    """activities are (start, finish); return a max-size compatible subset."""
    activities.sort(key=lambda a: a[1])     # sort by finish time
    chosen = []
    last_finish = float("-inf")
    for start, finish in activities:
        if start >= last_finish:            # compatible with the last pick
            chosen.append((start, finish))
            last_finish = finish
    return chosen


import heapq

def huffman_code_lengths(freqs: dict[str, int]) -> int:
    """Return the total bits of the optimal Huffman encoding."""
    heap = list(freqs.values())
    heapq.heapify(heap)
    total = 0
    while len(heap) > 1:
        a = heapq.heappop(heap)             # two lowest frequencies
        b = heapq.heappop(heap)
        merged = a + b
        total += merged                     # each merge adds one bit of depth to its leaves
        heapq.heappush(heap, merged)
    return total
```

# Real World Analogy

Greedy is a hiker trying to reach the highest peak by **always stepping uphill**. On a single
smooth hill that works perfectly — every local step up leads to the summit (the greedy-choice
property holds). But in a mountain range, always stepping uphill strands you on a *local* peak,
missing the taller one across the valley. Knowing the terrain — whether local best guarantees
global best — is exactly the judgment greedy algorithms require.

# Examples

## Example 1 — Basic: activity selection

```python
acts = [(1, 4), (3, 5), (0, 6), (5, 7), (5, 9), (8, 9)]
activity_selection(acts)   # [(1, 4), (5, 7), (8, 9)]  -> 3 activities
```

**Why this is good:** sorting by finish time and greedily taking each compatible activity
yields the maximum count. Trying to sort by *start* time or by *shortest duration* instead
would give fewer activities — showing the greedy criterion must be the right one.

## Example 2 — Real-world: Huffman compression

```python
huffman_code_lengths({"a": 45, "b": 13, "c": 12, "d": 16, "e": 9, "f": 5})
# 224 total bits -- fewer than a fixed-length 3-bit code (300 bits)
```

**Why this is good:** repeatedly merging the two rarest symbols pushes them deep in the tree
(long codes) and keeps frequent symbols shallow (short codes), minimizing total bits. This
greedy build is the basis of real compressors (DEFLATE/ZIP, JPEG) — and it is provably optimal.

## Example 3 — Best practice / edge case: knapsack — greedy vs. DP

```text
items (value, weight), capacity W = 50:
  A: (60, 10)   ratio 6.0
  B: (100, 20)  ratio 5.0
  C: (120, 30)  ratio 4.0

Fractional: greedy by ratio -> A + B + 2/3 of C = 60+100+80 = 240  (OPTIMAL)
0/1:        greedy by ratio -> A + B = 160, no room for C
            optimal (DP)     -> B + C = 220   (greedy MISSED it)
```

**Why this is good:** identical data, opposite verdicts. Greedy is optimal for the fractional
version but wrong for 0/1, which needs DP. This is the canonical warning to prove the
greedy-choice property before trusting a greedy algorithm.

# Common Mistakes

- **Using greedy without proving it correct.** A plausible greedy rule can be wrong; verify
  the greedy-choice property (often via an exchange argument) or find a counterexample.
- **Picking the wrong greedy criterion.** Activity selection needs *earliest finish*, not
  earliest start or shortest duration.
- **Assuming greedy solves 0/1 knapsack.** It does not; only the fractional version yields to
  greedy. Use DP for 0/1.
- **Confusing "works on my examples" with "optimal".** Greedy must be optimal on *all* inputs;
  test adversarial cases.

# Best Practices

- Before coding greedy, **state and justify** the greedy-choice property, or construct a
  counterexample to rule it out.
- Prefer greedy when it is *provably* correct — it is simpler and usually faster than DP.
- When greedy fails, fall back to **dynamic programming** (it considers all choices).
- Use a **heap** when the greedy step is "repeatedly take the smallest/largest" (Huffman,
  Dijkstra, Prim).

# Summary

- Greedy makes the locally optimal choice at each step and never backtracks.
- It is correct only with the **greedy-choice property** and **optimal substructure**.
- Activity selection (sort by finish time) and Huffman coding are greedy and optimal, `O(n log n)`.
- Greedy solves **fractional** knapsack but **not** 0/1 knapsack — that needs DP.
- Always justify greed; a locally best choice is not always globally best.

# Flash Cards

Q: What two properties must a problem have for a greedy algorithm to be optimal?
A: The greedy-choice property (a global optimum is reachable via locally optimal choices) and optimal substructure.

Q: What is the correct greedy criterion for the activity-selection problem?
A: Sort by finish time and repeatedly take the next activity that starts after the last chosen one finishes.

Q: How does Huffman coding build an optimal prefix code?
A: Repeatedly remove the two lowest-frequency nodes from a min-heap and merge them, until one tree remains.

Q: Why does greedy work for fractional knapsack but not 0/1 knapsack?
A: Fractions let you fully use capacity by value/weight ratio (optimal); with all-or-nothing items, a high-ratio item can block a better combination, so 0/1 needs DP.

Q: How does a greedy algorithm differ from dynamic programming?
A: Greedy commits to one locally best choice and never reconsiders; DP explores all choices and reuses overlapping subproblems.

Q: What proof technique is commonly used to justify a greedy choice?
A: An exchange argument — showing an optimal solution can be transformed to include the greedy choice without becoming worse.

# Exercises

### Easy
Given meetings `(start, finish)`, use activity selection to find the maximum number that can
run in one room. Try sorting by start time instead and show it can give a worse answer.

### Medium
Implement the **coin change** problem greedily (largest coin first) and find a coin system
(e.g. `{1, 3, 4}`, amount `6`) where it returns a non-optimal answer, confirming DP is needed.

### Challenging
Prove the greedy-choice property for activity selection: show that some maximum-size set of
compatible activities includes the activity with the earliest finish time. (Hint: exchange the
earliest-finishing activity into any optimal solution.)

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 15
  ("Greedy Algorithms"): activity selection, Huffman codes, and greedy vs. DP.
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 5.5 (Huffman compression).
- Skiena, *The Algorithm Design Manual*, 3rd ed. — Sections on greedy heuristics and when they are exact.
