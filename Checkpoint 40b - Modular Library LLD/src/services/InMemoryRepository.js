import { Repository } from "../interfaces/Repository.js";

export class InMemoryRepository extends Repository {
  constructor() {
    super();
    this.store = new Map();
  }

  save(id, item) {
    this.store.set(id, item);
    return item;
  }

  findById(id) {
    return this.store.get(id) || null;
  }

  findAll() {
    return Array.from(this.store.values());
  }
}