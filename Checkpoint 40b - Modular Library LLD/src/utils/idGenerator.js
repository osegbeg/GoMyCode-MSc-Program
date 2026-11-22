export function generateId(prefix = "ID") {
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-4)}-${randomPart}`;
}