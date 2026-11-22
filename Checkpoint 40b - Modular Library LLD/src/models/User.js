import { Observer } from "../interfaces/Observer.js";

export class User extends Observer {
  constructor(id, name, email, role) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  getMaxLoanDays() {
    throw new Error("Subclasses must implement getMaxLoanDays().");
  }

  update(eventPayload) {
    console.log(`[Email Alert -> ${this.name} <${this.email}>]: ${eventPayload.message}`);
  }
}

export class Student extends User {
  constructor(id, name, email) {
    super(id, name, email, "student");
  }

  getMaxLoanDays() {
    return 14;
  }
}

export class Faculty extends User {
  constructor(id, name, email) {
    super(id, name, email, "faculty");
  }

  getMaxLoanDays() {
    return 30;
  }
}