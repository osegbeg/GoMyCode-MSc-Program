import { FineStrategy } from "../interfaces/FineStrategy.js";

export class StandardFineStrategy extends FineStrategy {
  calculateFine(daysOverdue) {
    return daysOverdue * 1.5; // $1.50 per overdue day
  }
}

export class FacultyGraceFineStrategy extends FineStrategy {
  calculateFine(daysOverdue) {
    const chargeableDays = Math.max(0, daysOverdue - 5); // 5-day grace period
    return chargeableDays * 1.0;
  }
}