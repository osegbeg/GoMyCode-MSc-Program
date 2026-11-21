import { User, Student, Teacher } from "../models/User";

export type UserRole = "student" | "teacher";

export class UserFactory {
  public static createUser(type: UserRole, userId: string, name: string, email: string): User {
    switch (type.toLowerCase()) {
      case "student":
        return new Student(userId, name, email);
      case "teacher":
        return new Teacher(userId, name, email);
      default:
        throw new Error(`Unsupported user type: ${type}`);
    }
  }
}