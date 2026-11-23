const generator = require("generate-password");

function generateRandomPassword() {
  const password = generator.generate({
    length: 14,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    strict: true,
  });

  console.log("Generated Password:", password);
  return password;
}

generateRandomPassword();