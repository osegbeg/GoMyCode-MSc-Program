/**
 * Recursively tests whether a given word is a palindrome.
 *
 * Processing rules:
 * 1. Stop condition: An empty word or a single-character word is a palindrome (true).
 * 2. Compare characters at both ends:
 *    - If different -> stop and return false.
 *    - If equal -> recursively test the remaining inner substring.
 */
export function isPalindrome(word: string): boolean {
  // Normalize casing so "Radar" or "Kayak" are handled accurately
  const normalized = word.toLowerCase();

  // Stop condition (Base Case): empty string or single character
  if (normalized.length <= 1) {
    return true;
  }

  // Compare first and last characters
  const firstChar = normalized[0];
  const lastChar = normalized[normalized.length - 1];

  if (firstChar !== lastChar) {
    return false;
  }

  // Equality holds -> recursively test the rest of the word (excluding both ends)
  return isPalindrome(normalized.slice(1, -1));
}

// --- Verification Tests ---
const testWords = ["gag", "kayak", "php", "radar", "hello", "a", "", "Madam"];

console.log("=== Recursive Palindrome Verification ===");
for (const w of testWords) {
  console.log(`"${w}" -> ${isPalindrome(w)}`);
}