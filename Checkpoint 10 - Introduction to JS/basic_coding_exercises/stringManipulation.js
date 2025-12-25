//a function that reverses a given string.
function stringReversal(str) {
  if (typeof str != 'string') {
    return 'The provided argument should be a string'
  }
  
  let reversedString = "";
  for (let i = str.length-1; i >=0; i--) {    
    reversedString = reversedString + str[i];
  }
  return reversedString;
}

//test the function
console.log(stringReversal('Games'))
console.log(stringReversal(6552))


//function to count strings in an argument
function stringCounter(str){
  if (typeof str != 'string') {
    return 'The provided argument should be a string'
  }  
  let len = 0
  /* since we cannot use the length method, 
  we will stop the loop when Any index ≥ string length is undefined*/
  for(let i = 0; str[i] !== undefined; i++){
    len ++;
  }
  return len;

}
//test 
console.log(stringCounter(''))


//function to capitalize the first letter of every word in a sentence
function wordCapitalizer(sentence){
  let splitWord = sentence.split(/\s+/); //to split when there are one or more spaces
  let capitalizeWord = [];
  for (let i = 0; i < splitWord.length; i++){
    // Skip empty strings (just in case)
    if (splitWord[i] === "") continue;
    let firstChar = splitWord[i][0].toUpperCase()
    let otherChars = splitWord[i].slice(1)
    let capitalized = firstChar + otherChars
    capitalizeWord.push(capitalized)
  }
  let outcome = capitalizeWord.join(" ")
  return outcome;
}
//test
console.log(wordCapitalizer('We are people'))
console.log(wordCapitalizer('We      are      people'))




