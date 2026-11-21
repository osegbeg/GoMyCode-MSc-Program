import { User } from "./User";
import { Book } from "./Book";

export class BorrowTransaction {
  public readonly transactionId: string;
  public readonly user: User;
  public readonly book: Book;
  public readonly borrowDate: Date;
  public readonly dueDate: Date;
  public returned: boolean = false;
  public isOverdue: boolean = false; // Flag to simulate or track overdue books

  constructor(transactionId: string, user: User, book: Book) {
    this.transactionId = transactionId;
    this.user = user;
    this.book = book;
    this.borrowDate = new Date();

    const due = new Date(this.borrowDate);
    due.setDate(due.getDate() + user.getLoanDays());
    this.dueDate = due;
  }

  public markReturned(): void {
    this.returned = true;
    this.isOverdue = false;
    this.book.isAvailable = true;
    this.user.removeBorrowedBook(this.book.isbn);
  }

  public toString(): string {
    const state = this.returned ? "Returned" : this.isOverdue ? "OVERDUE" : "Active";
    return `TXN-${this.transactionId}: ${this.user.name} -> '${this.book.title}' | Due: ${this.dueDate.toISOString().split("T")[0]} | Status: ${state}`;
  }
}