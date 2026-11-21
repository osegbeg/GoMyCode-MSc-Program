import { User } from "../models/User";
import { Book } from "../models/Book";
import { BorrowTransaction } from "../models/BorrowTransaction";
import { NotificationService } from "../patterns/NotificationService";

export class LibrarySystem {
  private static instance: LibrarySystem;
  private users: Map<string, User> = new Map();
  private books: Map<string, Book> = new Map();
  private transactions: BorrowTransaction[] = [];
  public readonly notificationService: NotificationService = new NotificationService();

  // Private constructor prevents direct instantiation with `new LibrarySystem()`
  private constructor() {}

  public static getInstance(): LibrarySystem {
    if (!LibrarySystem.instance) {
      LibrarySystem.instance = new LibrarySystem();
    }
    return LibrarySystem.instance;
  }

  // --- User Management Subsystem ---
  public addUser(user: User): void {
    this.users.set(user.userId, user);
    this.notificationService.subscribe(user);
    console.log(`Added user: ${user.toString()}`);
  }

  // --- Book Management Subsystem ---
  public addBook(book: Book): void {
    this.books.set(book.isbn, book);
    console.log(`Added book: ${book.toString()}`);
  }

  // --- Borrowing Subsystem ---
  public borrowBook(userId: string, isbn: string): BorrowTransaction | null {
    const user = this.users.get(userId);
    const book = this.books.get(isbn);

    if (!user) {
      console.log(`Error: User ID '${userId}' not found.`);
      return null;
    }
    if (!book) {
      console.log(`Error: Book ISBN '${isbn}' not found.`);
      return null;
    }
    if (!book.isAvailable) {
      console.log(`Unavailable: '${book.title}' is currently borrowed.`);
      return null;
    }
    if (user.borrowedBooks.length >= user.getMaxBorrowLimit()) {
      console.log(`Limit Reached: ${user.name} cannot exceed ${user.getMaxBorrowLimit()} borrowed books.`);
      return null;
    }

    book.isAvailable = false;
    user.addBorrowedBook(book.isbn);
    const txnId = String(this.transactions.length + 1).padStart(3, "0");
    const transaction = new BorrowTransaction(txnId, user, book);
    this.transactions.push(transaction);
    console.log(`Borrowed: ${transaction.toString()}`);
    return transaction;
  }

  public returnBook(userId: string, isbn: string): void {
    const activeTxn = this.transactions.find(
      (txn) => txn.user.userId === userId && txn.book.isbn === isbn && !txn.returned
    );

    if (!activeTxn) {
      console.log(`Error: No active loan found for User '${userId}' and ISBN '${isbn}'.`);
      return;
    }

    activeTxn.markReturned();
    console.log(`Returned: '${activeTxn.book.title}' by ${activeTxn.user.name}`);
  }

  public viewBorrowedBooks(): void {
    console.log("\n--- Currently Borrowed Books ---");
    const active = this.transactions.filter((txn) => !txn.returned);
    if (active.length === 0) {
      console.log("No books are currently borrowed.");
    } else {
      active.forEach((txn) => console.log(`  ${txn.toString()}`));
    }
    console.log("--------------------------------\n");
  }

  public simulateOverdueCheck(transactionId: string): void {
    const txn = this.transactions.find((t) => t.transactionId === transactionId && !t.returned);
    if (txn) {
      txn.isOverdue = true;
      const alert = `OVERDUE ALERT: '${txn.book.title}' (ISBN: ${txn.book.isbn}) was due on ${
        txn.dueDate.toISOString().split("T")[0]
      }. Please return it immediately.`;
      this.notificationService.notifyUser(txn.user, alert);
    }
  }
}