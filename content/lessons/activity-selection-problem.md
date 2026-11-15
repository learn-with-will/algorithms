---
slug: activity-selection-problem
title: "Activity Selection and Interval Scheduling"
topic: greedy-and-backtracking
kind: pattern
summary: "Maximize non-overlapping activities by greedily selecting tasks with the earliest finish time."
tags: ["activity-selection", "intervals", "greedy", "scheduling"]
related: ["greedy-choice-property", "fractional-knapsack-greedy", "when-greedy-fails-vs-dp"]
---
> **In one line:** Maximize non-overlapping activities by greedily picking tasks with the earliest finish time.

## The idea

In the **Activity Selection Problem**, you are given a set of $n$ activities, each with a start time $s_i$ and finish time $f_i$. A single resource (e.g. a meeting room) can serve only one activity at a time. Maximize the total number of mutually compatible, non-overlapping activities scheduled.

Which greedy strategy works?
- Earliest start time? (Fails: an activity starting early could run all day!)
- Shortest duration? (Fails: can conflict with two other activities!)
- **Earliest finish time?** (**Optimal!**)

> **Tip:** Greedily selecting the activity that **finishes earliest** leaves the maximum possible free time remaining for all subsequent activities.

## See it

Activity selection implementation in Python:

```python
def select_activities(activities: list[tuple[int, int]]) -> list[tuple[int, int]]:
    # Sort activities by FINISH time: f_i
    sorted_act = sorted(activities, key=lambda a: a[1])
    
    selected = []
    last_finish = -1
    
    for start, finish in sorted_act:
        # If start time is after or equal to the last finish time, schedule it!
        if start >= last_finish:
            selected.append((start, finish))
            last_finish = finish
            
    return selected

# Activities: (start, finish)
meetings = [(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11)]
scheduled = select_activities(meetings)
print("Maximum non-overlapping activities scheduled:", len(scheduled))  # 3: [(1, 4), (5, 7), (8, 11)]
```

## Go deeper

Sorting $n$ activities by finish time dominates the execution cost: **$O(n \log n)$ time**. 

Once sorted, the single greedy pass takes linear $O(n)$ time and $O(1)$ auxiliary space. This interval scheduling pattern is widely used in calendar booking engines, CPU task dispatchers, and air traffic control runway scheduling.

From an algorithmic engineering perspective, understanding the precise operational characteristics of activity selection and interval scheduling allows developers to avoid subtle performance degradations when scaling from prototype test fixtures to high-throughput production environments. Hardware architectures heavily reward sequential memory locality and predictable branching patterns; when computational bounds are strictly respected, the runtime overhead of garbage collection and CPU cache invalidation remains strictly bounded.

Furthermore, theoretical complexity bounds must always be evaluated in conjunction with constant factor overheads. In practical systems programming, low-overhead algorithms often outperform asymptotically superior methods on small-to-moderate inputs, underscoring the importance of benchmark profiling alongside formal asymptotic verification.

Finally, maintaining clear architectural boundaries between data representation and procedural manipulation simplifies debugging and long-term code maintenance. When each computational component adheres to explicit invariants and pre-conditions, whole systems become significantly more resilient to unexpected edge cases and data corruption.

## Watch out

- Sorting by start time or duration produces suboptimal schedules; you MUST sort by finish time.
- Activities can touch at boundary points (start == last_finish) without overlapping.

## Remember

- Interval scheduling maximizes compatible tasks by sorting by finish time.
- Runs in O(n log n) time, dominated by the initial sort.
- Proven optimal using the standard greedy exchange argument.
