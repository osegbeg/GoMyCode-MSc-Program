## 1. Requirement Analysis

### Main Actors
1. **Member (Student / Faculty):** Searches the catalog, views book availability, borrows/requests books, returns borrowed items, and views personal loan history.
2. **Librarian:** Issues and processes book returns, manages catalog inventory (add/update/remove books), registers members, and handles overdue penalties/notifications.
3. **System Administrator:** Manages user roles, system permissions, audit logs, and backup/configuration settings.

### Key Use Cases
| Use Case ID | Use Case Name | Primary Actor | Description |
| :--- | :--- | :--- | :--- |
| **UC-01** | Search Book Catalog | Member, Librarian | Search books by title, author, ISBN, or category and check real-time availability. |
| **UC-02** | Issue (Borrow) Book | Librarian, Member | Validate member borrowing eligibility and book availability, then create an active loan transaction. |
| **UC-03** | Return Book | Librarian | Record returned book, update book status to Available, and calculate overdue fines if past due date. |
| **UC-04** | Manage Book Inventory | Librarian | Add new books, update metadata/copies, or retire damaged/lost books from the catalog. |
| **UC-05** | Manage Member Accounts | Librarian, Admin | Register new library members, update profiles, or suspend accounts with overdue items. |

---

## 2. System Architecture Design

The system follows a **3-Tier Layered Architecture** enforcing separation of concerns:
* **Presentation Layer (UI):** Web/Client interface for Members and Librarians to search books, submit loan requests, and manage catalog records.
* **Business Logic Layer (Service / Domain Layer):** Encapsulates core rules (borrowing limits, loan duration calculation, overdue fine rules, inventory state transitions).
* **Data Access Layer (Repository & Database):** Abstracts persistence (\`BookRepository\`, \`MemberRepository\`, \`LoanRepository\`) over a relational database (PostgreSQL / MSSQL).

### High-Level Architectural Diagram
${bt}mermaid
flowchart TB
    subgraph Presentation[\"Presentation Layer (UI)\"]
        MemberUI[\"Member Portal (Search & Loans)\"]
        AdminUI[\"Librarian & Admin Dashboard\"]
    end

    subgraph Business[\"Business Logic Layer (Domain Services)\"]
        CatalogSvc[\"CatalogService\"]
        CirculationSvc[\"CirculationService (Issue / Return)\"]
        MemberSvc[\"MemberService\"]
        NotificationSvc[\"NotificationService\"]
    end

    subgraph DataAccess[\"Data Access Layer (Repositories)\"]
        BookRepo[\"BookRepository\"]
        LoanRepo[\"LoanRepository\"]
        MemberRepo[\"MemberRepository\"]
        DB[(\"Relational Database\")]
    end

    MemberUI --> CatalogSvc
    MemberUI --> CirculationSvc
    AdminUI --> CatalogSvc
    AdminUI --> CirculationSvc
    AdminUI --> MemberSvc

    CatalogSvc --> BookRepo
    CirculationSvc --> BookRepo
    CirculationSvc --> LoanRepo
    CirculationSvc --> MemberRepo
    CirculationSvc --> NotificationSvc
    MemberSvc --> MemberRepo

    BookRepo --> DB
    LoanRepo --> DB
    MemberRepo --> DB
${bt}

---

## 3. Object-Oriented Analysis (OOA)

### A. Use Case Diagram
${bt}mermaid
flowchart LR
    Member([\"Member\"])
    Librarian([\"Librarian\"])
    Admin([\"System Admin\"])

    subgraph LMS[\"Library Management System\"]
        UC1([\"UC-01: Search Book Catalog\"])
        UC2([\"UC-02: Issue Book\"])
        UC3([\"UC-03: Return Book\"])
        UC4([\"UC-04: Manage Book Inventory\"])
        UC5([\"UC-05: Manage Member Accounts\"])
        UC6([\"UC-06: Configure System & Roles\"])
    end

    Member --> UC1
    Member --> UC2
    Member --> UC3

    Librarian --> UC1
    Librarian --> UC2
    Librarian --> UC3
    Librarian --> UC4
    Librarian --> UC5

    Admin --> UC5
    Admin --> UC6
${bt}

### B. Class Diagram
${bt}mermaid
classDiagram
    class User {
        <<abstract>>
        -string userId
        -string name
        -string email
        +login() boolean
        +getMaxBorrowLimit()* int
    }

    class Member {
        -string membershipId
        -string memberType
        -int activeLoansCount
        -boolean isSuspended
        +canBorrow() boolean
        +getMaxBorrowLimit() int
    }

    class Librarian {
        -string employeeId
        -string shift
        +issueBook(member: Member, book: Book) LoanTransaction
        +processReturn(loan: LoanTransaction) void
        +getMaxBorrowLimit() int
    }

    class Book {
        -string isbn
        -string title
        -string author
        -string category
        -BookStatus status
        +isAvailable() boolean
        +markIssued() void
        +markReturned() void
    }

    class LoanTransaction {
        -string transactionId
        -Date issueDate
        -Date dueDate
        -Date returnDate
        -number fineAmount
        +calculateFine(currentDate: Date) number
        +closeTransaction(returnDate: Date) void
    }

    class Catalog {
        -Book[] books
        +addBook(book: Book) void
        +removeBook(isbn: string) void
        +searchByTitle(query: string) Book[]
        +searchByIsbn(isbn: string) Book
    }

    User <|-- Member
    User <|-- Librarian
    Catalog \"1\" o-- \"*\" Book : contains
    Member \"1\" -- \"*\" LoanTransaction : borrows
    Book \"1\" -- \"*\" LoanTransaction : tracked in
    Librarian \"1\" -- \"*\" LoanTransaction : authorizes
${bt}

### C. Sequence Diagrams

#### Sequence 1: Issue (Borrow) Book
${bt}mermaid
sequenceDiagram
    actor Librarian
    participant UI as CirculationUI
    participant Service as CirculationService
    participant Member as Member
    participant Book as Book
    participant Repo as LoanRepository

    Librarian->>UI: submitIssueRequest(memberId, isbn)
    UI->>Service: issueBook(memberId, isbn)
    Service->>Member: canBorrow()
    Member-->>Service: true (under limit & active)
    Service->>Book: isAvailable()
    Book-->>Service: true (AVAILABLE)
    Service->>Book: markIssued()
    Service->>Repo: createTransaction(memberId, isbn, dueDate)
    Repo-->>Service: LoanTransaction
    Service-->>UI: IssueConfirmed(transaction)
    UI-->>Librarian: Display Receipt & Due Date
${bt}

#### Sequence 2: Return Book
${bt}mermaid
sequenceDiagram
    actor Librarian
    participant UI as CirculationUI
    participant Service as CirculationService
    participant Loan as LoanTransaction
    participant Book as Book
    participant Repo as LoanRepository

    Librarian->>UI: submitReturn(transactionId)
    UI->>Service: returnBook(transactionId)
    Service->>Repo: findById(transactionId)
    Repo-->>Service: LoanTransaction
    Service->>Loan: calculateFine(today)
    Loan-->>Service: fineAmount
    Service->>Loan: closeTransaction(today)
    Service->>Book: markReturned()
    Service->>Repo: update(LoanTransaction)
    Service-->>UI: ReturnConfirmed(fineAmount)
    UI-->>Librarian: Show Return Summary & Any Fine
${bt}

### D. State Diagram (Book Lifecycle)
${bt}mermaid
stateDiagram-v2
    [*] --> Available : Book Added to Catalog
    Available --> Issued : issueBook() [Member Eligible]
    Issued --> Overdue : dueDate Passed [Not Returned]
    Issued --> Returned : returnBook() [On or Before Due Date]
    Overdue --> Returned : returnBook() + Fine Settled
    Returned --> Available : Inspection Passed / Reshelved
    Available --> Retired : removeBook() [Damaged / Lost]
    Retired --> [*]
${bt}

---

## 4. Data, Functional, and Behavioral Modeling

1. **Data Model (Entity Relationships & Structure):**
   * **User (1) — (1) Member / Librarian:** Stores identity attributes (\`userId\`, \`name\`, \`email\`, \`role\`).
   * **Book (1) — (0..N) LoanTransaction:** Tracks book catalog attributes (\`isbn\` PK, \`title\`, \`author\`, \`status\`).
   * **Member (1) — (0..N) LoanTransaction:** Associates each loan (\`transactionId\` PK, \`memberId\` FK, \`isbn\` FK, \`issueDate\`, \`dueDate\`, \`returnDate\`, \`fineAmount\`) with a single borrower and book copy.
2. **Functional Model (Data Transformations & Operations):**
   * **Catalog Search:** \`(SearchQuery) -> Catalog.search() -> FilteredBookList\`
   * **Book Issuance:** \`(MemberID, ISBN) -> Validate Eligibility & Availability -> Active LoanTransaction + Updated Book Status\`
   * **Book Return:** \`(TransactionID, ReturnDate) -> Compute Overdue Fine -> Closed LoanTransaction + Available Book Status\`
3. **Behavioral Model (Event-Driven State Transitions):**
   * Modeled via the **State Diagram** and **Sequence Diagrams** above: external events (\`issueBook\`, \`dueDatePassed\`, \`returnBook\`, \`reshelve\`) trigger guarded state transitions on \`Book\` and \`LoanTransaction\` objects while enforcing business invariants (e.g., an \`Issued\` book cannot be re-issued until it transitions back to \`Available\`).

---

## 5. Abstraction to Implementation (TypeScript Code Snippets)

Below is how the analyzed \`Book\`, \`Member\`, and \`CirculationService\` models translate directly into encapsulated TypeScript classes:

${bt}typescript
export enum BookStatus {
  AVAILABLE = \"AVAILABLE\",
  ISSUED = \"ISSUED\",
  OVERDUE = \"OVERDUE\",
  RETURNED = \"RETURNED\",
  RETIRED = \"RETIRED\",
}

export class Book {
  private readonly isbn: string;
  private title: string;
  private author: string;
  private status: BookStatus;

  constructor(isbn: string, title: string, author: string) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.status = BookStatus.AVAILABLE;
  }

  public isAvailable(): boolean {
    return this.status === BookStatus.AVAILABLE;
  }

  public markIssued(): void {
    if (!this.isAvailable()) {
      throw new Error(\`Book '\${this.title}' is not available for borrowing.\`);
    }
    this.status = BookStatus.ISSUED;
  }

  public markReturned(): void {
    this.status = BookStatus.RETURNED;
    this.status = BookStatus.AVAILABLE;
  }

  public getDetails(): string {
    return \`[\${this.isbn}] \${this.title} by \${this.author} - Status: \${this.status}\`;
  }
}

export class Member {
  private readonly memberId: string;
  private name: string;
  private activeLoans: number = 0;
  private readonly maxBorrowLimit: number = 3;
  private isSuspended: boolean = false;

  constructor(memberId: string, name: string) {
    this.memberId = memberId;
    this.name = name;
  }

  public canBorrow(): boolean {
    return !this.isSuspended && this.activeLoans < this.maxBorrowLimit;
  }

  public incrementLoans(): void {
    this.activeLoans++;
  }

  public decrementLoans(): void {
    if (this.activeLoans > 0) this.activeLoans--;
  }
}

export class CirculationService {
  public issueBook(member: Member, book: Book): void {
    if (!member.canBorrow()) {
      throw new Error(\"Member is suspended or has reached the maximum borrow limit.\");
    }
    if (!book.isAvailable()) {
      throw new Error(\"Requested book is currently unavailable.\");
    }

    book.markIssued();
    member.incrementLoans();
    console.log(\`Book issued successfully: \${book.getDetails()}\`);
  }
}
${bt}
`; fs.writeFileSync('README.md', content, 'utf8'); console.log('README.md written cleanly!');"