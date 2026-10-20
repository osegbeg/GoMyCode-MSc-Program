// fibonacci sequence
function fibonacci(n) {
  // Base cases
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Recursive step
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test Cases (Sequence: 0, 1, 1, 2, 3, 5, 8, 13...)
console.log(fibonacci(0)); // 0
console.log(fibonacci(6)); // 8
console.log(fibonacci(7)); // 13


//Palindrome checker

function isPalindrome(str) {
  // 1. Clean the string: remove spaces/punctuation and convert to lowercase
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Helper recursive inner function
  function check(s) {
    // Base Case: 0 or 1 character left means it's a palindrome
    if (s.length <= 1) return true;

    // Check if outer characters match
    if (s[0] !== s[s.length - 1]) return false;

    // Recursive Step: strip outer characters and test the rest
    return check(s.slice(1, s.length - 1));
  }

  return check(cleaned);
}

// Test Cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("racecar"));                      // true
console.log(isPalindrome("hello"));                        // false