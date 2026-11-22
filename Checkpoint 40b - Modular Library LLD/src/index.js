import { Book } from "./models/Book.js";
import { UserFactory } from "./patterns/UserFactory.js";
import { StandardFineStrategy, FacultyGraceFineStrategy } from "./patterns/FineStrategies.js";
import { EventBus } from "./patterns/EventBus.js";
import { InMemoryRepository } from "./services/InMemoryRepository.js";
import { LibraryService } from "./services/LibraryService.js";
import { addDays } from "./utils/dateUtils.js";

// 1. Compose dependencies (Dependency Injection)
const library = new LibraryService({
  userRepository: new InMemoryRepository(),
  bookRepository: new InMemoryRepository(),
  loanRepository: new InMemoryRepository(),
  fineStrategy: new StandardFineStrategy(),
  eventBus: new EventBus(),
});

// 2. Create Users via Factory Pattern
const student = UserFactory.createUser("student", "Denzel Osegbe", "denzel@school.edu");
const faculty = UserFactory.createUser("faculty", "Golden-Joe Osegbe", "goldenjoe@school.edu");

library.registerUser(student);
library.registerUser(faculty);

// 3. Add Books
const cleanCode = new Book("978-0132350884", "Clean Code", "Robert C. Martin");
const refactoring = new Book("978-0134757599", "Refactoring", "Martin Fowler");

library.addBook(cleanCode);
library.addBook(refactoring);

console.log("\n--- Borrowing Books ---");
const studentLoan = library.borrowBook(student.id, cleanCode.isbn);
const facultyLoan = library.borrowBook(faculty.id, refactoring.isbn);

// 4. Return Student's book 4 days late using StandardFineStrategy ($1.50/day = $6.00)
console.log("\n--- Returning Student Book (Standard Strategy) ---");
const lateStudentReturn = addDays(studentLoan.dueDate, 4);
library.returnBook(studentLoan.loanId, lateStudentReturn);

// 5. Swap Strategy dynamically at runtime for Faculty (5-day grace period -> 7 days late = 2 chargeable days = $2.00)
console.log("\n--- Swapping to Faculty Grace Strategy & Returning Faculty Book ---");
library.setFineStrategy(new FacultyGraceFineStrategy());
const lateFacultyReturn = addDays(facultyLoan.dueDate, 7);
library.returnBook(facultyLoan.loanId, lateFacultyReturn);