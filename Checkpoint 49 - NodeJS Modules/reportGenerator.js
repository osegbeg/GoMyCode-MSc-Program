function generateReport(name, scores) {
  if (!Array.isArray(scores) || scores.length === 0) {
    throw new Error("Scores must be a non-empty array of numbers.");
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;
  const status = average >= 10 ? "PASS" : "FAIL";

  return [
    "====================================",
    `Student Report: ${name}`,
    "====================================",
    `Scores  : ${scores.join(", ")}`,
    `Average : ${average.toFixed(2)}`,
    `Status  : ${status}`,
    "====================================",
  ].join("\n");
}

module.exports = { generateReport };