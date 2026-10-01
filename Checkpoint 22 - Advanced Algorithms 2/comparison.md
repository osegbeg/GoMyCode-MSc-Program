# Delivery Platform Task Scheduler: Algorithmic Analysis

## 1. Comparison of the Two Approaches

### Speed for Large Inputs
The **Greedy Algorithm** is exponentially faster for large inputs. It runs in $O(N \log N)$ time, dominated primarily by sorting tasks by their end times. In contrast, the **Brute-Force** approach runs in $O(2^N)$ time because it generates every possible subset of tasks. While the Greedy algorithm processes 10,000 tasks in a few milliseconds, the Brute-Force approach freezes the system on inputs larger than 25–30 tasks.

### Maintainability and Scalability
The Greedy algorithm is much easier to maintain and scale. Its logic is concise, linear, and predictable. Adding thousands of tasks per second will not crash the backend system.

### Memory Trade-offs
The Greedy algorithm uses minimal memory ($O(N)$ space to store the sorted array copy and results). The Brute-Force approach consumes $O(N)$ stack memory for call stacks during recursion, but creates millions of temporary combination objects in memory, which quickly triggers garbage collection pauses or out-of-memory (OOM) crashes.

---

## 2. Recommendation & Justification

### Recommendation
I recommend using the **Greedy Algorithm (Earliest End Time First)** for the delivery platform.

### Justification
* **Real-Time Performance:** Operating in a real-time system with thousands of requests per second requires sub-millisecond execution times. Greedy's $O(N \log N)$ operational cost guarantees fast throughput.
* **Mathematical Proof of Optimality:** For the Activity Selection Problem, picking tasks with the earliest end time is mathematically proven to always yield the maximum possible number of non-overlapping activities.
* **When Brute-Force Might Be Relevant:** Brute-force is only relevant in testing environments as a ground-truth baseline to verify small sample outputs during unit testing, or if complex business constraints are added (e.g., non-linear delivery payout combinations) where the greedy property no longer holds.