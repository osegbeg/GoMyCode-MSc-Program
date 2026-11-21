export abstract class User {
  private _userId: string;
  private _name: string;
  private _email: string;
  private _borrowedBooks: string[] = [];

  constructor(userId: string, name: string, email: string) {
    if (new.target === User) {
      throw new Error("Cannot instantiate abstract class User directly.");
    }
    this._userId = userId;
    this._name = name;
    this._email = email;
  }

  public get userId(): string {
    return this._userId;
  }

  public get name(): string {
    return this._name;
  }

  public get borrowedBooks(): string[] {
    return [...this._borrowedBooks];
  }

  // Abstract methods enforced on subclasses
  public abstract getMaxBorrowLimit(): number;
  public abstract getLoanDays(): number;

  public addBorrowedBook(isbn: string): void {
    this._borrowedBooks.push(isbn);
  }

  public removeBorrowedBook(isbn: string): void {
    this._borrowedBooks = this._borrowedBooks.filter((item) => item !== isbn);
  }

  // Observer update method
  public update(message: string): void {
    console.log(`[Notification -> ${this._name} (${this._email})]: ${message}`);
  }

  public toString(): string {
    return `${this.constructor.name}(ID=${this._userId}, Name=${this._name})`;
  }
}

export class Student extends User {
  public getMaxBorrowLimit(): number {
    return 3;
  }

  public getLoanDays(): number {
    return 14;
  }
}

export class Teacher extends User {
  public getMaxBorrowLimit(): number {
    return 10;
  }

  public getLoanDays(): number {
    return 30;
  }
}