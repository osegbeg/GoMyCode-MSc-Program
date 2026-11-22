export class FineStrategy {
  constructor() {
    if (new.target === FineStrategy) {
      throw new Error("FineStrategy is an interface-like abstraction and cannot be instantiated directly.");
    }
  }

  calculateFine(daysOverdue) {
    throw new Error("Method 'calculateFine(daysOverdue)' must be implemented.");
  }
}