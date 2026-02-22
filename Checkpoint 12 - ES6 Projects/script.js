//Mumbling
function accum(s) {
  let splitStr = s.split("")
  let acca = []
  
  for (let i = 0; i < splitStr.length; i++){
    let letterAcca = splitStr[i].toUpperCase()
    for (let j = 0; j < i; j++){
      letterAcca += splitStr[i].toLowerCase()
    }
    acca.push(letterAcca)
  }
  return acca.join("-")
}

//Opposite number
function opposite(number) {
  return number * -1
}

//Get the Middle Character
function getMiddle(s) {
  middleIndex = Math.floor(s.length / 2)
  if (s.length % 2 !== 0){
    return s[middleIndex]
  }
  else{
    return `${s[middleIndex -1] + s[middleIndex]}`
  };
}
//Vowel Count
function getCount(str) {
  let lowerSentence = str.toLowerCase()
  let vowels = ["a", "e", "i", "o", "u"]
  let vowelCount = 0
  for (let i = 0; i < vowels.length; i++){
    for (let j = 0; j < lowerSentence.length; j++){
      if (vowels[i] === lowerSentence[j]){
        vowelCount++
      }
    }
  }
  return vowelCount
}


//Even or Odd
function evenOrOdd(number) {
    if(number%2 === 0){
    return "Even"
  }
  else{
    return "Odd"
  }  
}

//perfect square

var isSquare = function(n){
  let sqrRoot = n ** 0.5
  if (sqrRoot - Math.floor(sqrRoot) !== 0){
    return false
  }
  else{
    return true
  }
}

function rgb(r, g, b) {
  const toHex = (num) => {
    // Clamp the value between 0 and 255
    const clamped = Math.max(0, Math.min(255, num));
    // Convert to hex, uppercase, and ensure 2 characters
    return clamped.toString(16).toUpperCase().padStart(2, '0');
  };

  return toHex(r) + toHex(g) + toHex(b);
}

function areYouPlayingBanjo(name) {
  // Implement me
  if(name[0] == "R" || name[0] == "r"){
    return name + " plays banjo" 
  }
  else{
    return name + " does not play banjo"
  }
  
}

function monkeyCount(n) {
// your code here
  let arr = []
  for(let i = 1; i <= n; i++)
    arr.push(i)
  return arr
}

function greet(name){
  
  if(name === "Johnny"){
    return "Hello, my love!"};
  return "Hello, " + name + "!";
}

var summation = function (num) {
  // Code here
  let sum = 0;
  for (let i = 1; i <= num; i++){
    sum += i
  }
  return sum
}

class Dinglemouse{

  constructor( firstName, lastName ){
    this.firstName = firstName;
    this.lastName = lastName;
  }
  
  getFullName(){
    return `${this.firstName} ${this.lastName}`.trim();
  }
  
}

//write your code here 
questions.forEach(function(item) {
  item.usersAnswer = null;
});

// TODO: solve the barking problem!
Dog.prototype.bark = function() {
  return 'Woof!';
};

var Ball = function(ballType) {
  // your code goes here
  this.ballType = ballType || "regular";
};

function digitize(n) {
  //code here
  let nArr = String(n).split("")
  let outcome = []
  for (let j = nArr.length-1; j >= 0; j--){
    outcome.push(Number(nArr[j]))
  }
  return outcome
}

function removeSmallest(numbers) {
  let copy = [...numbers];
  let smallest = Math.min(...copy)
  let index = copy.indexOf(smallest)
  copy.splice(index, 1)
  return copy
}

function findNeedle(haystack) {
  // your code here
  return `found the needle at position ${haystack.indexOf("needle")}`
}

const binaryArrayToNumber = arr => {
  // your code
  let sum = 0;
  for (let i = 0; i <= arr.length-1; i++){
    let digit = arr[i] * (2 ** (arr.length - (i + 1)))
    sum += digit
  }
  return sum;
};

function countSheeps(sheep) {
  // TODO
  let count = 0;
  for(let i = 0; i <= sheep.length-1; i++){
    if (sheep[i]){
      count++
    }
  }
  return count
}

function DNAtoRNA(dna) {
  // create a function which returns an RNA sequence from the given DNA sequence
  outcome = ""
  for (let i = 0; i <= dna.length-1; i++){
    if(dna[i] === "T"){
      outcome += "U"
    }
    else{
      outcome += dna[i].toUpperCase()
    }
  }
  return outcome
}

function abbrevName(name){

    // code away
  let nameArr = name.split(" ")
  let output = []
  for (let i = 0; i <= nameArr.length-1; i++){
    output.push(nameArr[i][0].toUpperCase())
  }
  return output.join(".")
}

function bonusTime(salary, bonus) {
// your code here
  if(bonus){
    return `\u00A3${salary * 10}`
    
  }
  else{
    return `\u00A3${salary}`
  }
}

function solution(str, ending){
  // TODO: complete
  return str.endsWith(ending);
}

function solution(str){
  let outcome = ""
  for(let i = str.length - 1; i>= 0; i--){
    outcome += str[i]
  }
  return outcome  
}

function maps(x){
  let newMap = []
  for (let i = 0; i < x.length; i++){
    newMap.push(x[i] * 2)
  }
  return newMap
}

function century(year) {
  // Finish this :)
  return Math.ceil(year/100);
}

function litres(time) {
  
  return Math.floor(time * 0.5);
}

function SeriesSum(n) {
  // Happy Coding ^_^
  let sum = 0;
  for(let i = 1; i <= n; i++){
    let ith = 1/((3*i) - 2)
    sum += ith
  }
  return sum.toFixed(2)
}

function basicOp(operation, value1, value2) {
  //Code
  if (operation == "/") {
    return value1 / value2
  }
  else if (operation == "*"){
    return value1 * value2
  }
  else if (operation == "+") {
    return value1 + value2
  }
  else if (operation == "-") {
    return value1 - value2
  }

}

function numberToString(num) {
  // Return a string of the number here!
  return String(num)
}

function boolToWord( bool ){
  //...
  return bool ? "Yes" : "No";
}

function removeChar(str){
 //You got this!
  let outcome = ""
  if(str.length < 3){
    return ""
  }
  for(let i = 1; i < str.length - 1; i++){
    outcome += str[i]
  }
  return outcome
}



function noSpace(x){
  return x.replaceAll(" ", "")

}

function makeNegative(num) {
  // Code?
  if (num < 0){
    return num
  }
  else{
    return num * -1
  }
}

function divisors(integer) {
  let output = []
  for (let i = 2; i < integer; i++){
    if(integer % i === 0){
      output.push(i)
    }
  }
  if (output.length == 0){
    return `${integer} is prime`
  }
  else{
    return output
  }
}
  

function rowSumOddNumbers(n) {
	// TODO
  return n ** 3
}

// return masked string
function maskify(cc) {
  let output = []
  let sentenceArr = cc.split("")
  for(let i = sentenceArr.length - 1; i >= 0; i--){
    if(output.length < 4){
      output.unshift(sentenceArr[i])
    }
    else{
      output.unshift("#")
    }
  }
  return output.join("")

}

function findNextSquare(sq) {
  // Return the next square if sq is a perfect square, -1 otherwise
  let sqrt = sq ** 0.5
  if(sqrt - Math.floor(sqrt) !== 0 ){
    return -1;
  }
  else{
    return (sqrt + 1) ** 2
  }
}

function isTriangle(a,b,c)
{
  if(a + b > c && a + c > b && b + c > a){
    return true;
  }
  else{
   return false;
  }
}

function repeatStr (n, s) {
  return s.repeat(n);
}

function nbYear(p0, percent, aug, p) {
    // your code
  n = 0
  while (p0 < p){
    newP = p0 + ((percent/100) * p0) + aug
    p0 = Math.floor(newP)
    n++
  }
  return n
}

function sumTwoSmallestNumbers(numbers) {  
  // Code here
  newArr = []
  for(let i = 0; i < 2; i++){
    minNum = Math.min(...numbers)
    index = numbers.findIndex(number => number == minNum)
    newArr.push(minNum)
    numbers.splice(index, 1)
  }
  return newArr[0] + newArr[1]
}

function findSmallestInt(arr) {
  //your code here
  return Math.min(...arr);
}

function filter_list(l) {
  // Return a new array with the strings filtered out
  let filtered = l.filter((ele) => typeof(ele) == "number")
  return filtered
}

function isIsogram(str){
   let strArr = str.toLowerCase().split("")
   let checker = []
   for (let i = 0; i < strArr.length; i++){
     if(checker.includes(strArr[i])){
       return false
     }
     else {
       checker.push(strArr[i])
     }
   }
   return true
}

function positiveSum(arr) {
  let sum = 0
  for (let i = 0; i < arr.length; i++){
    if (arr[i] > 0 ){
      sum += arr[i]
    }
  }
  return sum  
}

function descendingOrder(n){
  let outcome = []
  let n2String = String(n).split("")
  while (n2String.length > 0){
    let maxn = Math.max(...n2String)
    let index = n2String.indexOf(String(maxn))
    outcome.push(maxn)
    n2String.splice(index, 1)
  }
  return Number(outcome.join(""))
}

function dnaStrand(dna){
  let output = ""
  let dnaUpper = dna.toUpperCase()
  for(let i = 0; i<dnaUpper.length; i++){
    if(dnaUpper[i] === "A"){
      output += "T"
    }
    else if (dnaUpper[i] === "T"){
      output += "A"
    }

    else if (dnaUpper[i] === "G") {
      output += "C"
    }
    else if (dnaUpper[i] === "C") {
      output += "G"
    }

    else{
      return "Not a valid DNA"
    }
  }
  return output
}

function findShort(s){
  let arr = []
  let splitS = s.split(" ")
  for (let i = 0; i < splitS.length; i++){
    arr.push(splitS[i].length)
  }
  return Math.min(...arr)
}

function squareDigits(num){
  let numToStr = String(num)
  let splitStr = numToStr.split("")
  let newStr = []
  for(let i = 0; i < splitStr.length; i++){
    newStr.push(splitStr[i] ** 2)
  }
  return Number(newStr.join(""))
}

function XO(str) {
  let xCount = 0
  let oCount = 0
  let strNeutral = str.toLowerCase()
  for (let i = 0; i < strNeutral.length; i++){
    if(strNeutral[i] == "x"){
      xCount++
    }
    else if (strNeutral[i] == "o"){
      oCount++
    }
  }
  if (xCount == oCount){
    return true
  }
  else{
    return false
  }
}


function highAndLow(numbers){
  let splitnumbers = numbers.split(" ").map(x => Number(x))
  let maxNum = Math.max(...splitnumbers)
  let minNum = Math.min(...splitnumbers)
  return `${maxNum} ${minNum}`
}

function disemvowel(str) {
  let newstr = ""
  for (let i = 0; i < str.length; i++){
    if (str[i] !== "a" && str[i] !== "A" && str[i] !== "e" 
      && str[i] !== "E" && str[i] !== "i" && str[i] !== "I"
      && str[i] !== "o" && str[i] !== "O" && str[i] !== "u" 
      && str[i] !== "U"){
      newstr += str[i]
      }
  }
  return newstr
}

var isSquare = function(n){
  let sqrRoot = n ** 0.5
  if (sqrRoot - Math.floor(sqrRoot) !== 0){
    return false
  }
  else{
    return true
  }
}

function accum(s) {
  let splitStr = s.split("")
  let acca = []
  
  for (let i = 0; i < splitStr.length; i++){
    let letterAcca = splitStr[i].toUpperCase()
    for (let j = 0; j < i; j++){
      letterAcca += splitStr[i].toLowerCase()
    }
    acca.push(letterAcca)
  }
  return acca.join("-")
}


function opposite(number) {
  return number * -1
}

function getMiddle(s) {
  middleIndex = Math.floor(s.length / 2)
  if (s.length % 2 !== 0){
    return s[middleIndex]
  }
  else{
    return `${s[middleIndex -1] + s[middleIndex]}`
  };
}

function getCount(str) {
  let lowerSentence = str.toLowerCase()
  let vowels = ["a", "e", "i", "o", "u"]
  let vowelCount = 0
  for (let i = 0; i < vowels.length; i++){
    for (let j = 0; j < lowerSentence.length; j++){
      if (vowels[i] === lowerSentence[j]){
        vowelCount++
      }
    }
  }
  return vowelCount
}

function evenOrOdd(number) {
    if(number%2 === 0){
    return "Even"
  }
  else{
    return "Odd"
  }  
}
