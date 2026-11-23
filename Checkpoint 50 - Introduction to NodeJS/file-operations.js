const fs = require("fs");

// 1. Create welcome.txt containing one line "Hello Node"
fs.writeFileSync("welcome.txt", "Hello Node", "utf8");
console.log("welcome.txt created successfully.");

// 2. Read and console.log data (supports hello.txt as stated, falling back to welcome.txt)
const targetFile = fs.existsSync("hello.txt") ? "hello.txt" : "welcome.txt";
const data = fs.readFileSync(targetFile, "utf8");
console.log(`Content of ${targetFile}:`, data);