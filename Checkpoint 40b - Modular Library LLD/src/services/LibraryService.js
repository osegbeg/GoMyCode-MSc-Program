import { addDays, getDaysOverdue, formatDate } from "../utils/dateUtils.js";
import { generateId } from "../utils/idGenerator.js";

export class LibraryService {
  // Dependencies are injected rather than hardcoded for testability & modularity
  constructor({ userRepository, bookRepository, loanRepository, fineStrategy, eventBus }) {
    this.userRepository = userRepository;
    this.bookRepository = bookRepository;
    this.loanRepository = loanRepository;
    this.fineStrategy = fineStrategy;
    this.eventBus = eventBus;
  }

  setFineStrategy(newStrategy) {
    this.fineStrategy = newStrategy;
  }

  registerUser(user) {
    this.userRepository.save(user.id, user);
    this.eventBus.subscribe("OVERDUE_NOTICE", user);
    return user;
  }

  addBook(book) {
    return this.bookRepository.save(book.isbn, book);
  }

  borrowBook(userId, isbn) {
    const user = this.userRepository.findById(userId);
    const book = this.bookRepository.findById(isbn);

    if (!user || !book) throw new Error("User or Book not found.");
    if (!book.isAvailable) throw new Error(`'${book.title}' is currently unavailable.`);

    book.isAvailable = false;
    const dueDate = addDays(new Date(), user.getMaxLoanDays());
    const loan = {
      loanId: generateId("LOAN"),
      userId: user.id,
      isbn: book.isbn,
      dueDate,
      returned: false,
    };

    this.loanRepository.save(loan.loanId, loan);
    console.log(`Issued '${book.title}' to ${user.name} (Due: ${formatDate(dueDate)})`);
    return loan;
  }

  returnBook(loanId, simulatedReturnDate = new Date()) {
    const loan = this.loanRepository.findById(loanId);
    if (!loan || loan.returned) throw new Error("Active loan not found.");

    const book = this.bookRepository.findById(loan.isbn);
    const user = this.userRepository.findById(loan.userId);

    loan.returned = true;
    book.isAvailable = true;

    const overdueDays = getDaysOverdue(loan.dueDate, simulatedReturnDate);
    const fine = this.fineStrategy.calculateFine(overdueDays);

    if (overdueDays > 0) {
      this.eventBus.publish("OVERDUE_NOTICE", {
        userId: user.id,
        message: `Book '${book.title}' was returned ${overdueDays} day(s) late. Calculated fine: $${fine.toFixed(2)}.`,
      });
    }

    console.log(`Returned '${book.title}' | Overdue Days: ${overdueDays} | Fine: $${fine.toFixed(2)}`);
    return { loan, overdueDays, fine };
  }
}