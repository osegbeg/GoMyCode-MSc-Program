export class Book {
  private _isbn: string;
  private _title: string;
  private _author: string;
  private _isAvailable: boolean = true;

  constructor(isbn: string, title: string, author: string) {
    this._isbn = isbn;
    this._title = title;
    this._author = author;
  }

  public get isbn(): string {
    return this._isbn;
  }

  public get title(): string {
    return this._title;
  }

  public get isAvailable(): boolean {
    return this._isAvailable;
  }

  public set isAvailable(status: boolean) {
    this._isAvailable = status;
  }

  public toString(): string {
    const status = this._isAvailable ? "Available" : "Borrowed";
    return `'${this._title}' by ${this._author} (ISBN: ${this._isbn}) [${status}]`;
  }
}