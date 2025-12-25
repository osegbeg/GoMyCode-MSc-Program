//function to find the maximum number in an array
function findMaxNumber(arr){
  // Check if arr is really an array
  if (!Array.isArray(arr)) {
    return 'Please enter an array of numbers';
  }

  // Handle empty array
  if (arr.length === 0) {
    return 'The array is empty. Therefore no max number';
  }
  let maxNumber = -Infinity
  for (let i = 0; i < arr.length; i++){
    if(typeof arr[i] != 'number'){
      continue;
    }
    if (arr[i] > maxNumber){
      maxNumber = arr[i]
    }
  }
  return maxNumber;
}
//test
console.log(findMaxNumber([3,'a','hello', 34]))


//function to find the minimum number in an array
function findMinNumber(arr){
  // Check if arr is really an array
  if (!Array.isArray(arr)) {
    return 'Please enter an array of numbers';
  }

  // Handle empty array
  if (arr.length === 0) {
    return 'The array is empty. Therefore no min number';
  }
  let minNumber = Infinity
  for (let i = 0; i < arr.length; i++){
    if(typeof arr[i] != 'number'){
      continue;
    }
    if (arr[i] < minNumber){
      minNumber = arr[i]
    }
  }
  return minNumber;
}
//test
console.log(findMinNumber([3,'a','hello', 34, -12]))


//function to calculate the sum of numbers in an array
function calculateSum(arr){
  // Check if arr is really an array
  if (!Array.isArray(arr)) {
    return 'Please enter an array of numbers';
  }

  // Handle empty array
  if (arr.length === 0) {
    return 'The array is empty. Therefore nothing to add';
  }
  let sum = 0
  for (let i = 0; i < arr.length; i++){
    if(typeof arr[i] != 'number'){
      continue;
    }
    sum += arr[i];
  }
  return sum;
}
//test
console.log(calculateSum([0, -1, 9, 65, 'hello', -43]))

