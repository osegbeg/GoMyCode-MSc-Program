const crypto = require("crypto");

const users = [];

module.exports = {
  findByEmail(email) {
    return users.find((u) => u.email === email.toLowerCase());
  },
  findById(id) {
    return users.find((u) => u.id === id);
  },
  findByGoogleId(googleId) {
    return users.find((u) => u.googleId === googleId);
  },
  create({ name, email, passwordHash = null, googleId = null }) {
    const user = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      googleId,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    return user;
  },
};