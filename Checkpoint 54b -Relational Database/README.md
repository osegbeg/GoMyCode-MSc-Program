# Concurrency Control & Distributed Database Design — Banking System

---

## Part 1: Transaction Management & Concurrency Control

### 1. Concurrency Issue Identified: **Lost Update** (and Inconsistent Analysis / Dirty Read)
When two users simultaneously initiate transfers involving the same account (e.g., Account `A` starts with a balance of **$1,000**):
* **Transaction 1 ($T_1$)** reads Account `A`'s balance (`$1,000`) to deduct `$200`.
* **Transaction 2 ($T_2$)** concurrently reads Account `A`'s balance (`$1,000`) before $T_1$ commits, intending to deduct `$300`.
* $T_1$ writes `$800` (`1000 - 200`), and then $T_2$ overwrites it with `$700` (`1000 - 300`).
* **Result:** $T_1$'s `$200` deduction is completely overwritten (**Lost Update**), leaving Account `A` with `$700` instead of the true balance of `$500`. (Additionally, if $T_2$ reads $T_1$'s uncommitted balance and $T_1$ subsequently rolls back, a **Dirty Read** occurs.)

---

### 2. Proposed Locking Mechanism: **Exclusive Lock (X-Lock)**
* **Write Operations (Transfers):** Transactions modifying account balances must acquire an **Exclusive Lock (`X-Lock`)** on the involved account rows (in SQL: `SELECT balance FROM accounts WHERE account_id = ? FOR UPDATE`). While an `X-Lock` is held, no other transaction can read (for update) or write to that account until the active transaction commits or rolls back.
* **Read-Only Operations (View Balances):** Pure balance inquiries can use a **Shared Lock (`S-Lock`)** (or MVCC snapshot reads) so multiple users can view balances simultaneously without blocking one another, while still preventing reads of uncommitted dirty writes.
* **Deadlock Prevention:** When a transfer locks two accounts (source and destination), locks should always be acquired in a consistent canonical order (e.g., ascending `account_id`) to prevent circular wait deadlocks.

---

### 3. Pessimistic vs. Optimistic Locking Choice
* **Choice:** **Pessimistic Locking**
* **Justification:**
  1. **High Contention & Financial Integrity:** In banking systems, concurrent updates to active accounts carry high financial risk; preventing conflicts upfront is safer than detecting them after execution.
  2. **Lower Rollback Cost:** Optimistic locking assumes conflicts are rare and aborts/retries transactions at commit time if a version mismatch is detected. Under concurrent transfers on the same account, optimistic retries waste CPU/I/O and degrade user experience, whereas pessimistic locking serializes access cleanly at the row level.

---

### 4. Concurrent Transaction Schedule Analysis

Assume Account `A` starts with **$1,000**. $T_1$ transfers **$200** from `A`, and $T_2$ transfers **$300** from `A`.

#### A. Unsafe Uncontrolled Schedule (Produces Lost Update)

| Step | Transaction $T_1$ (Debit $200) | Transaction $T_2$ (Debit $300) | Balance in DB | Schedule Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `BEGIN TRANSACTION` | — | $1,000 | **Unsafe** (No locks acquired) |
| 2 | `READ(A)` → `$1,000` | `BEGIN TRANSACTION` | $1,000 | **Unsafe** |
| 3 | `A = 1000 - 200` (`$800`) | `READ(A)` → `$1,000` (Stale read) | $1,000 | **Unsafe** ($T_2$ reads stale value) |
| 4 | `WRITE(A = 800)` | `A = 1000 - 300` (`$700`) | $800 | **Unsafe** |
| 5 | `COMMIT` | `WRITE(A = 700)` | $700 | **Unsafe — Lost Update ($200 lost)** |
| 6 | — | `COMMIT` | $700 | **Corrupted State** (Should be $500) |

#### B. Safe Serialized Schedule Using Two-Phase Locking (`X-Lock`)

| Step | Transaction $T_1$ (Debit $200) | Transaction $T_2$ (Debit $300) | Balance in DB | Schedule Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `BEGIN` & `X-LOCK(A)` | — | $1,000 | **Safe** ($T_1$ holds exclusive lock) |
| 2 | `READ(A)` → `$1,000` | `BEGIN` & Request `X-LOCK(A)` → **BLOCKED** | $1,000 | **Safe** ($T_2$ waits in queue) |
| 3 | `WRITE(A = 800)` | *Waiting for $T_1$...* | $800 | **Safe** |
| 4 | `COMMIT` & `UNLOCK(A)` | *Lock granted:* `X-LOCK(A)` | $800 | **Safe** ($T_1$ changes persisted) |
| 5 | — | `READ(A)` → `$800` | $800 | **Safe** ($T_2$ reads updated balance) |
| 6 | — | `WRITE(A = 500)` & `COMMIT` & `UNLOCK(A)` | $500 | **Safe — Conflict-Serializable ($500)** |

---

## Part 2: Distributed Database Planning (Tunis, Sousse, Sfax)

### 1. Horizontal Fragmentation Strategy (`Customers` Table)
Partition the `Customers` table into three disjoint row subsets based on the customer's registered home branch (`branch_city`), so each branch locally stores and serves its primary customer base with minimal network latency:

* **Fragment 1 (`Customers_Tunis`):**
  $$\sigma_{\text{branch\_city} = \text{'Tunis'}}(\text{Customers})$$
  *Stored at the **Tunis** branch node.*
* **Fragment 2 (`Customers_Sousse`):**
  $$\sigma_{\text{branch\_city} = \text{'Sousse'}}(\text{Customers})$$
  *Stored at the **Sousse** branch node.*
* **Fragment 3 (`Customers_Sfax`):**
  $$\sigma_{\text{branch\_city} = \text{'Sfax'}}(\text{Customers})$$
  *Stored at the **Sfax** branch node.*

* **Completeness & Disjointness:** Every customer belongs to exactly one home branch, ensuring the union of all three fragments reconstructs the full `Customers` table without duplicate rows.

---

### 2. Vertical Fragmentation Suggestion
Separate security-sensitive authentication credentials from general customer profile data into a dedicated `Customer_Auth` table:

* **Separated Column(s):** `password_hash` (along with `security_pin` / `mfa_secret`), linked via `customer_id` (Primary/Foreign Key).
* **Justification:**
  1. **Security & Access Control:** Branch tellers querying `Customers` for daily service (`name`, `phone`, `branch_city`) do not need access to authentication credentials.
  2. **Performance:** Keeping bulky/sensitive auth columns in a separate table reduces row width for routine customer lookups and isolates login verification traffic to a dedicated authentication service.

---

### 3. Data Replication Strategy Across All Branches
* **Data to Replicate:** **Core Customer Info** (specifically basic customer identity/routing lookup records—`customer_id`, `full_name`, `home_branch`—and branch reference metadata) and **Read-Only/Snapshot Account Balances** (or synchronously replicated active account balances if cross-branch withdrawals are permitted).
* **Why:**
  1. **Cross-Branch Availability:** A customer registered in Tunis may walk into a branch in Sousse or Sfax to withdraw cash or verify their identity. Replicating core customer lookup data and account balances ensures any branch can authenticate the customer and verify sufficient funds locally even if wide-area network (WAN) links between branches experience latency or temporary outages.
  2. **Low Update Frequency on Customer Info:** Customer identity attributes rarely change, making full replication across Tunis, Sousse, and Sfax inexpensive to synchronize compared to high-frequency transactional tables.

---

### 4. Allocation Strategy for `Transaction_History`: **Static vs. Dynamic**
* **Choice:** **Static Allocation** (with regional partitioning by originating branch and periodic archiving to a central data warehouse).
* **Justification:**
  1. **Append-Only Workload:** Financial transaction records are immutable once committed (`INSERT`-only, never updated or moved between branches). Because access locality does not shift dynamically over time, migrating fragments at runtime (dynamic allocation) adds unnecessary synchronization overhead and audit complexity.
  2. **Regulatory & Audit Predictability:** Static placement guarantees auditors and branch managers always know the exact physical node holding a branch's ledger records.