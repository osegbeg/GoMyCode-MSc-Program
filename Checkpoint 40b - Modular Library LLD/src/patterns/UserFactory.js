import { Student, Faculty } from "../models/User.js";
import { generateId } from "../utils/idGenerator.js";

export class UserFactory {
  static createUser(role, name, email) {
    const normalized = role.trim().toLowerCase();
    switch (normalized) {
      case "student":
        return new Student(generateId("STU"), name, email);
      case "faculty":
        return new Faculty(generateId("FAC"), name, email);
      default:
        throw new Error(`Invalid user role '${role}'. Expected 'student' or 'faculty'.`);
    }
  }
}