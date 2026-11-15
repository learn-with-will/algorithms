---
slug: balanced-brackets-with-stacks
title: "Validating Balanced Parentheses"
topic: stacks-queues-and-hash-tables
kind: pattern
summary: "Validate nested bracket syntax by pushing open delimiters and matching closing delimiters against the stack top."
tags: ["stack", "parentheses", "parsing", "patterns"]
related: ["lifo-stack-operations", "fifo-queue-operations", "monotonic-stack-technique"]
---
> **In one line:** Match nested delimiters in linear time by pushing openers and popping against matching closers.

## The idea

Compilers, linters, and runtime engines constantly parse source code containing nested pairs: `()`, `[]`, and `{}`. A bracket sequence is valid if and only if:
1. Every opening bracket is closed by a matching bracket of the same type.
2. Brackets are closed in the correct nested order (inner before outer).

A stack is the natural data structure for this problem:
- When encountering an **opening bracket** (`(`, `[`, `{`), push it onto the stack.
- When encountering a **closing bracket** (`)`, `]`, `}`), the stack must not be empty, and its top element must match the corresponding opening type. Pop the top opener.
- At the end of the string, the stack must be completely empty.

```flow
ch: Read Next Char | from input string @primary
open: Is Opener? | push to stack @blue
close: Is Closer? | pop and check match @amber
end: End of String | stack must be empty @green
ch -> open: ('(', '[', '{')
ch -> close: (')', ']', '}')
close -> end
```

## See it

Validating bracket expressions in Python:

```python
def is_valid_brackets(s: str) -> bool:
    matching = {')': '(', ']': '[', '}': '{'}
    stack = []
    
    for ch in s:
        if ch in matching.values():
            stack.append(ch)
        elif ch in matching:
            if not stack or stack.pop() != matching[ch]:
                return False
                
    return len(stack) == 0

print(is_valid_brackets("{[()]}"))  # Output: True
print(is_valid_brackets("{[(])}"))  # Output: False (mismatched nesting)
print(is_valid_brackets("(()"))     # Output: False (unclosed opener)
```

## Go deeper

This algorithm runs in strictly $O(n)$ time and $O(n)$ space, where $n$ is string length. Each character is pushed and popped at most once.

This fundamental pattern forms the core of pushdown automata (PDA) in formal language theory. While regular expressions cannot validate arbitrarily nested parentheses (they lack memory), a simple stack easily handles arbitrary nesting depths.

From an algorithmic engineering perspective, understanding the precise operational characteristics of validating balanced parentheses allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

## Watch out

- Forgetting to check if stack is empty at the end fails to catch unclosed opening brackets like '((('.
- Attempting to pop an empty stack on strings starting with closing brackets like ')' raises an unhandled error without an emptiness check.

## Remember

- Push opening brackets; pop and verify on closing brackets.
- A non-empty stack at string termination indicates unclosed delimiters.
- The algorithm runs in optimal O(n) time and O(n) auxiliary memory.
