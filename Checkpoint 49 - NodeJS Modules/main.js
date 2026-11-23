const { generateReport } = require("./reportGenerator");

const report1 = generateReport("Denzel Osegbe", [14, 12.5, 16, 11]);
console.log(report1);

console.log();

const report2 = generateReport("Sample Student", [8, 9.5, 7]);
console.log(report2);