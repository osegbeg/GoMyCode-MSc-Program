//function to calculate factorial of a number
function calculateFactiorial(num){
  let product = 1;
  for (let i = num; i > 0; i--){
    product *= i;
  }
  return product
}
//test
console.log(calculateFactiorial(5))

//function to check if a number is a Prime Number
function checkPrime(num){
  if (typeof num != 'number'){
    return 'Please enter a number'
  }
  if (num <= 1) {
    return `${num} is NOT a prime number`
  }
  for (let i = 2; i < num; i++){

    if(num%i===0){
      return `${num} is NOT a prime number`
    }
  }
  return `${num} is a prime number`
}
//test
console.log(checkPrime(17))


//function to solve fibonacci series and output the given number of terms i.e 5 will output an array of 5 items
function solveFibonacci(num){
  if (typeof num != 'number'){
    return 'Please enter a number'
  }
  let fibonacciSeries = [0,1]
  
  if (num === 0) {return 0;}
  if (num === 1) {return [0]}
  if (num === 2) {return [0,1]}

  let sum = 1
  let count = 2

  while (count < num){
    sum = fibonacciSeries[count-1] + fibonacciSeries[count-2]
    fibonacciSeries.push(sum)
    count++
  }

  return fibonacciSeries

}
//test
console.log(solveFibonacci(4))
