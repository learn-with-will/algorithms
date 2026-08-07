---
id: lesson-05
slug: stacks-and-queues
title: "Stacks and Queues"
level: beginner
order: 5
duration: 24
tags:
  - stack
  - queue
  - lifo
  - fifo
  - deque
---

# Learning Objectives

By the end of this lesson you will be able to:

- Define a **stack** (LIFO) and a **queue** (FIFO) by their access discipline.
- Implement each with `O(1)` operations using the right Python container.
- Explain why using a `list` as a queue (with `pop(0)`) is an `O(n)` trap.
- Use `collections.deque` for `O(1)` operations at both ends.
- Recognize where stacks and queues appear inside larger algorithms.

# Why This Concept Exists

Stacks and queues are **restricted** data structures: they deliberately allow only a
tiny set of operations, at one or both ends. That restriction is a feature. By fixing
*where* you add and remove elements, they guarantee a specific processing order — last
in first out, or first in first out — that turns out to be exactly what countless
algorithms need. Depth-first search, expression evaluation, and undo stacks all rely on
LIFO; breadth-first search, schedulers, and buffers all rely on FIFO. Both offer all
their operations in `O(1)`, so they are as cheap as they are useful.

# Concept Explanation

### Stack — Last In, First Out (LIFO)

A **stack** adds and removes from the same end, the **top**. The last element pushed is
the first popped. Its operations are:

- `push(x)` — add `x` to the top.
- `pop()` — remove and return the top element.
- `peek()` / `top()` — look at the top without removing it.
- `is_empty()` — whether the stack has any elements.

All are `O(1)`. A Python `list` is a perfect stack: `append` is push, `pop()` is pop —
both operate on the cheap end.

```text
push 1, push 2, push 3        pop -> 3      pop -> 2
   top                            top
  [1, 2, 3]                    [1, 2]      [1]
```

### Queue — First In, First Out (FIFO)

A **queue** adds at one end (the **back**) and removes from the other (the **front**).
The first element enqueued is the first dequeued. Its operations are:

- `enqueue(x)` — add `x` at the back.
- `dequeue()` — remove and return the front element.
- `peek()` — look at the front.

All should be `O(1)`. The catch: a Python `list` makes a *bad* queue, because removing
from the front with `pop(0)` shifts every remaining element and is `O(n)`. The right
tool is **`collections.deque`**, a double-ended queue whose `append` and `popleft` are
both `O(1)`.

### Deque — the double-ended queue

A **deque** ("deck") generalizes both: you can push and pop at *either* end in `O(1)`.
It can act as a stack, a queue, or both. Python's `collections.deque` is the standard
choice, implemented as a doubly linked list of blocks.

# Key Terminology

- **Stack** — LIFO; add/remove at the top.
- **Queue** — FIFO; add at the back, remove from the front.
- **Deque** — double-ended queue; `O(1)` at both ends.
- **push / pop / peek** — add / remove-top / inspect-top (stack vocabulary).
- **enqueue / dequeue** — add-back / remove-front (queue vocabulary).

# Complexity

| Structure | Operation | Time | Python |
| --------- | --------- | ---- | ------ |
| Stack | push / pop / peek | O(1) | `list.append` / `list.pop` |
| Queue | enqueue / dequeue / peek | O(1) | `deque.append` / `deque.popleft` |
| Queue (WRONG) | dequeue via `list.pop(0)` | O(n) | shifts all elements |
| Deque | push/pop at either end | O(1) | `collections.deque` |

Each holds `n` elements in `O(n)` space.

# Implementation in Python

```python
from collections import deque

# --- Stack: a plain list is ideal ---
stack: list[int] = []
stack.append(1)      # push
stack.append(2)      # push
top = stack.pop()    # pop -> 2  (LIFO)

# --- Queue: use deque, NOT list.pop(0) ---
queue: deque[int] = deque()
queue.append(1)      # enqueue
queue.append(2)      # enqueue
front = queue.popleft()   # dequeue -> 1  (FIFO)

# Guard against popping when empty
def safe_pop(s: list[int]) -> int | None:
    return s.pop() if s else None
```

# Real World Analogy

A **stack** is a pile of plates: you add and take from the top, so the last plate placed
is the first one used (LIFO). A **queue** is the line at a checkout: people join at the
back and are served from the front, so whoever arrived first leaves first (FIFO).
Jumping the queue — serving from the middle — is exactly the `O(n)` shifting we avoid by
using a proper queue structure.

# Examples

## Example 1 — Basic: balanced-parentheses check (a stack)

```python
def is_balanced(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack: list[str] = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)                 # push an opener
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False                 # mismatch or nothing to match
    return not stack                         # leftover openers => unbalanced
```

**Why this is good:** the LIFO order is exactly right — the most recent unmatched opener
must be the first to close. Each character is pushed/popped once, so the check is `O(n)`.

## Example 2 — Real-world: process tasks in arrival order (a queue)

```python
from collections import deque

def process_in_order(tasks: list[str]) -> list[str]:
    q = deque(tasks)
    done = []
    while q:
        task = q.popleft()      # O(1) dequeue, FIFO
        done.append(task)
    return done
```

**Why this is good:** `deque.popleft()` keeps each dequeue `O(1)`, so processing `n`
tasks is `O(n)`. This FIFO frontier is the exact shape of breadth-first search (Lesson 15).

## Example 3 — Best practice / edge case: the list-as-queue trap

```python
from collections import deque

# BAD: pop(0) shifts every remaining element -> O(n) each -> O(n²) total
q = [1, 2, 3, 4]
while q:
    x = q.pop(0)

# GOOD: deque.popleft is O(1) -> O(n) total
q = deque([1, 2, 3, 4])
while q:
    x = q.popleft()
```

**Why this is good:** the two loops look identical but differ by a whole complexity
class. Front removal on a `list` is `O(n)`; on a `deque` it is `O(1)`. For queues,
always reach for `deque`.

# Common Mistakes

- **Using `list.pop(0)` as a dequeue.** It is `O(n)`; use `collections.deque.popleft`.
- **Popping an empty stack/queue**, which raises `IndexError`. Check `if stack:` first.
- **Confusing the orders.** Stack = LIFO (top), queue = FIFO (front/back). Reaching for
  the wrong one gives correct-looking but wrongly-ordered results.
- **Peeking by indexing a deque repeatedly.** Random access into a `deque` is `O(n)`; it
  is optimized for its ends, not the middle.

# Best Practices

- Stack → a plain `list` (`append` / `pop`). Queue/deque → `collections.deque`.
- Always check for emptiness before `pop`/`popleft`, or catch `IndexError`.
- Pick the structure by the *order* you need to process elements, not by habit.
- Keep operations at the ends; if you need middle access, a stack/queue is the wrong tool.

# Summary

- A stack is LIFO (push/pop at the top); a queue is FIFO (enqueue at back, dequeue at front).
- Both provide all their operations in `O(1)` with the right container.
- A Python `list` is a great stack but a bad queue — `pop(0)` is `O(n)`.
- `collections.deque` gives `O(1)` at both ends and is the go-to queue/deque.
- LIFO powers DFS, undo, and expression parsing; FIFO powers BFS, scheduling, and buffering.

# Flash Cards

Q: What access discipline does a stack follow?
A: LIFO — last in, first out; you push and pop at the same end (the top).

Q: What access discipline does a queue follow?
A: FIFO — first in, first out; you enqueue at the back and dequeue from the front.

Q: Why is a Python list a poor queue?
A: Removing from the front with pop(0) shifts every remaining element, costing O(n); use collections.deque.popleft instead.

Q: Which Python container gives O(1) operations at both ends?
A: collections.deque, a double-ended queue implemented as a linked list of blocks.

Q: Which classic search uses a stack (LIFO), and which uses a queue (FIFO)?
A: Depth-first search uses a stack; breadth-first search uses a queue.

Q: What must you check before calling pop() on a stack or popleft() on a deque?
A: That it is non-empty — otherwise it raises IndexError.

# Exercises

### Easy
Implement a `Stack` class wrapping a `list` with `push`, `pop`, `peek`, and `is_empty`,
each `O(1)`, that raises a clear error when popping from empty.

### Medium
Evaluate a postfix (reverse Polish) expression such as `"3 4 + 2 *"` using a stack, and
explain why a stack is the natural fit.

### Challenging
Implement a queue using **two stacks** so that `enqueue` and `dequeue` are `O(1)`
*amortized*. Explain the amortized argument: each element is moved between the two stacks
at most once.

# Further Reading

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed. — Chapter 10,
  Section 10.1 ("Stacks and queues").
- Sedgewick & Wayne, *Algorithms*, 4th ed. — Section 1.3 ("Bags, Queues, and Stacks").
- Python — [`collections.deque`](https://docs.python.org/3/library/collections.html#collections.deque).
