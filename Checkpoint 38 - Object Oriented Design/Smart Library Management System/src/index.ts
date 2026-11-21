import { Book } from "./models/Book";
import { UserFactory } from "./patterns/UserFactory";
import { LibrarySystem } from "./services/LibrarySystem";

// 1. Verify Singleton Pattern
const libraryA = LibrarySystem.getInstance();
const libraryB = LibrarySystem.getInstance();
console.log(`Singleton Verified (libraryA === libraryB): ${libraryA === libraryB}\n`);

// 2. Create Users via Factory Pattern
const student = UserFactory.createUser("student", "U001", "Denzel Osegbe", "denzel@school.edu");
const teacher = UserFactory.createUser("teacher", "U002", "Golden-Joe Osegbe", "goldenjoe@school.edu");

libraryA.addUser(student);
libraryA.addUser(teacher);
console.log();

// 3. Add Books
const book1 = new Book("978-0132350884", "Clean Code", "Robert C. Martin");
const book2 = new Book("978-0201633610", "Design Patterns", "Erich Gamma et al.");
const book3 = new Book("978-0135957059", "The Pragmatic Programmer", "Andrew Hunt");

libraryA.addBook(book1);
libraryA.addBook(book2);
libraryA.addBook(book3);
console.log();

// 4. Borrow Books
const txn1 = libraryA.borrowBook("U001", "978-0132350884");
libraryA.borrowBook("U002", "978-0201633610");
libraryA.borrowBook("U002", "978-0132350884"); // Unavailable check

// 5. View Borrowed Books
libraryA.viewBorrowedBooks();

// 6. Simulate Overdue Flag & Trigger Observer Notification
console.log("--- Simulating Overdue Check ---");
if (txn1) {
  libraryA.simulateOverdueCheck(txn1.transactionId);
}
console.log();

// 7. Return Book & Verify Updated State
libraryA.returnBook("U001", "978-0132350884");
libraryA.viewBorrowedBooks();