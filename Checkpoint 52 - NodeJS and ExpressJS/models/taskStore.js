const crypto = require("crypto");

const tasks = [];

module.exports = {
  findAllByOwner(ownerId) {
    return tasks.filter((t) => t.ownerId === ownerId);
  },
  findById(id) {
    return tasks.find((t) => t.id === id);
  },
  create({ title, description = "", ownerId }) {
    const task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      ownerId,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
  },
  deleteById(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const [deleted] = tasks.splice(index, 1);
    return deleted;
  },
};