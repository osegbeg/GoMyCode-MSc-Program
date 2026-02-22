
---

## 📖 Clean Code by Robert C. Martin Summary

### ## Chapter 2: Meaningful Names

Naming is the "secret sauce" of clear code. Uncle Bob argues that bad names create technical debt by forcing developers to waste time deciphering intent, while good names make the logic "click" instantly.

* **Intent-Revealing:** Pick names that specify purpose. Use `daysSinceLastLogin` instead of `d`.
* **Avoid Disinformation:** Don't use misleading words (e.g., don't name something `accountList` if it’s actually a `Map`).
* **Pronounceable & Searchable:** If you can't say it or find it with a quick `Ctrl+F`, it's a bad name.
* **No Encodings:** Modern IDEs handle types; skip prefixes like `m_` or `v_`.
* **Parts of Speech:** * **Classes/Objects:** Should be nouns (`UserAccount`, `WikiPage`).
* **Methods:** Should be verbs (`sendEmail`, `deletePage`).


* **One Word per Concept:** Don't mix `fetch`, `retrieve`, and `get` for the same action across the codebase.

---

### ## Chapter 3: Functions

Functions should be the "atomic units" of your story. They should be small, focused, and organized by abstraction level.

* **The "Small" Rule:** Ideally, functions should be under 20 lines.
* **Do One Thing:** If a function performs multiple steps that could be their own named function, it's doing too much.
* **Function Arguments:** The fewer, the better.
* **0 (Niladic)** is ideal.
* **1 (Monadic)** or **2 (Dyadic)** are okay.
* **Avoid Flag Arguments:** Passing a boolean usually means the function does two different things.


* **Command-Query Separation:** A function should either **do** something or **answer** something, never both.
* **No Side Effects:** Don't hide "secret" tasks (like initializing a session) inside a function named `checkPassword`.
* **DRY (Don't Repeat Yourself):** Duplication is the root of all software evil.

---

### ## Chapter 4: Comments

Uncle Bob views comments as a "necessary evil" and a failure to express ourselves in code. Comments lie as code evolves; code always tells the truth.

* **The Good:**
* Legal requirements/Copyright.
* Explanation of intent (Why, not How).
* Clarifying complex RegEx or external library quirks.
* `// TODO` notes for future work.


* **The Bad:**
* **Redundant Comments:** Comments that repeat what the code already says.
* **Journaling:** Don't keep a log of changes in the file; use Git.
* **Commented-out Code:** Delete it. If you need it back, find it in your version control history.
* **Noise:** Don't add a comment just because a corporate style guide says every function needs one.



---

### ## Chapter 6: Objects and Data Structures

There is a fundamental "anti-symmetry" between Objects and Data Structures. Mixing the two creates "Hybrids" that are difficult to maintain.

| Feature | **Objects (OO)** | **Data Structures (Procedural)** |
| --- | --- | --- |
| **Visibility** | Hide data, expose behavior. | Expose data, have no behavior. |
| **Strengths** | Easy to add new *types* without changing functions. | Easy to add new *functions* without changing data types. |
| **Weaknesses** | Hard to add new functions (must change all classes). | Hard to add new types (must change all functions). |

* **The Law of Demeter:** A module should not know the innards of the objects it manipulates. Avoid "Train Wrecks" like `ctxt.getOptions().getScratchDir().getAbsolutePath()`.
* **DTOs (Data Transfer Objects):** These are the ultimate data structures—classes with public variables and no functions. They are perfect for communicating with databases or parsing sockets.
* **Abstraction:** Don't just add getters and setters; expose the *meaning* of the data through high-level methods.

---
