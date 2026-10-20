//Leap Year checker

function checkLeapYear(year) {
  if (year % 400 === 0) {
    return `${year} is a leap year (divisible by 400).`;
  } else if (year % 100 === 0) {
    return `${year} is NOT a leap year (divisible by 100 but not 400).`;
  } else if (year % 4 === 0) {
    return `${year} is a leap year (divisible by 4).`;
  } else {
    return `${year} is NOT a leap year.`;
  }
}

// Test Cases
console.log(checkLeapYear(2024)); // Leap year
console.log(checkLeapYear(1900)); // Not a leap year
console.log(checkLeapYear(2000)); // Leap year



//ticket pricing calculator

function getTicketPrice(age) {
  if (age <= 0) {
    return "Please enter a valid age.";
  } else if (age <= 12) {
    return "The ticket price for Children (age <= 12) is $10.";
  } else if (age >= 13 && age <= 17) {
    return "The ticket price for Teenagers (age 13-17) is $15.";
  } else {
    return "The ticket price for Adults (age >= 18) is $20.";
  }
}

// Test Cases
console.log(getTicketPrice(8));  // $10
console.log(getTicketPrice(15)); // $15
console.log(getTicketPrice(25)); // $20