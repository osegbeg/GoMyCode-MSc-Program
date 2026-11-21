import { User } from "../models/User";

export class NotificationService {
  private observers: User[] = [];

  public subscribe(user: User): void {
    if (!this.observers.includes(user)) {
      this.observers.push(user);
    }
  }

  public unsubscribe(user: User): void {
    this.observers = this.observers.filter((obs) => obs !== user);
  }

  public notifyUser(user: User, message: string): void {
    if (this.observers.includes(user)) {
      user.update(message);
    }
  }
}