export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDaysOverdue(dueDate, returnDate = new Date()) {
  const diffMs = returnDate.getTime() - dueDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function formatDate(date) {
  return date.toISOString().split("T")[0];
}