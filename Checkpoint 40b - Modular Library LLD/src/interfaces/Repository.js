export class Repository {
  save(id, item) {
    throw new Error("Method 'save(id, item)' must be implemented.");
  }

  findById(id) {
    throw new Error("Method 'findById(id)' must be implemented.");
  }

  findAll() {
    throw new Error("Method 'findAll()' must be implemented.");
  }
}