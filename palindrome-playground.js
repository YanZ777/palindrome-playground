
/*
Write a function, 
given an int return the next integer (positive) that is a palindrome.

single digit numbers count as palindromes

10 -> 11

123 -> 131

what to do if number itself is a palindrome
222 -> 232

234 -> 242

The brute force method of solving this problem, is to check if
each subsequent number is a palindrome. When one is found,
break and return that number. 
However, this would be incredibly slow for numbers that are really long.
i.e. 
88932598274983217123123
23 digits long!
It is really slow.
The next palindrome for that number is: 
88932598275057289523988

1 -> 2
11 -> 22
99 -> 101
1999 -> 2002
4312 -> 4334
2345 -> 2442
12345 -> 12421
10911 -> 11011
324571 -> 325523
1349181 -> 1349431
2378917 -> 2379732
1299741 -> 1299921
100999211 -> 101000101
542918434 -> 542919245

My intial thoughts were to take the number, cut it in half,
reverse the first half of the string and smash it all together.
Depending on how many digits there are, where you cut in half
matters. 
i.e. 12315 the first half of the string to reverse should be 12,
not 123
conversely, if the digit is 3256, the first half of the string to
reverse should be 32
But this doesn't work for all cases, such as 4231. 
Using the above method, it would give me 4224, which, while is a
palindrome, is not the next greatest palindrome. This should 
return 4334.
So in what situations would it be ok for it to perform the above
operations and in what cases would it not?
I noticed there was a pattern, if the second half of the string
(again, where you cut matters) is greater than or equal to the 
beginning half of the string reversed, you'd need to do a little
math.

i.e. 4315321
firstHalfReversed = 134
secondHalf = 321
firstHalfReversed <= secondHalf? -> true
You'd have to add the corresponding place value, and then perform
the above steps. 
Following the above example:
4315321
Since firstHalfReversed <= secondHalf
Add 1000 since 5 is the splitting number
4316321
431 6 321
reverse 431 -> 134
431 6 134

Another example:
5147
firstHalfReversed = 15
secondHalf = 47
firstHalfReversed <= secondHalf -> true
add 100 (since when you split it in half, the middle digit 
would be in the 100's place)
5247
52 47
reverse 52 -> 25
5225

Why does this work?
If you see that the second half less than the first half 
reversed then you can increment it to math the first half 
reversed to be a palindrome. 
However, when the second half is greater than or equal to
the first half reversed, then the chopping in half,
reversing, and smashing it back together will not work
because the resulting number will always be less than the
given number. What would need to be done would be to
increment the number just enough to create a new palindrome.
But what is "enough"? 
Enough would be where ever the midpoint is, add that place
value amount, e.g. 10's, 100's, 1000's, etc.
The resulting number can then use the stragetgy of chopping
in half, reversing, and smashing together.

Notes here: 
The numbers on the second half will always change.
The numbers in the first half may change depending, but the
changes shoudl be limited.
If the digit is less than 10, just return the number + 1 since
single digits are palindromes and manging split in half arrays
with one value is rather messy.
This solution does not handle large numbers such as the 23 digit
one provided above. There would need to be some sort of big int
handling built in.
*/

const test = 5147;

function returnNextPalindromeMathematically(num) {
  let nextPalindrome = num + 1
   if (num >= 10) {
      let brokenUpNum = splitDigitAsString(num);
      let firstHalfReversed = reverseString(brokenUpNum.firstHalf);
      let firstHalfReversedDigit = parseInt(firstHalfReversed);
      let secondHalfDigit = parseInt(brokenUpNum.secondHalf);
      if (firstHalfReversedDigit <= secondHalfDigit) {
        // Get the order of magnitude.
        // Order of magnitude is the length of the second half
        const orderOfMagnitude = brokenUpNum.secondHalf.length;
        const placeValue = 10 ** orderOfMagnitude;
        const increasedNum = num + placeValue;
        brokenUpNum = splitDigitAsString(increasedNum);
        firstHalfReversed = reverseString(brokenUpNum.firstHalf);
      }
      
      const palindromeString = brokenUpNum.firstHalf + brokenUpNum.middleDigit + firstHalfReversed;
      nextPalindrome = parseInt(palindromeString);
   }
  return nextPalindrome;
}

// Helper method to reverse a string.
// All values are returned as strings.
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Helper method for splitting a string.
// All values are returned as strings.
function splitDigitAsString(num) {
  const numString = num.toString();
  let chopPoint = numString.length / 2;
  let startSecond = chopPoint;
  let middleDigit = '';
  if (numString.length % 2 === 1) {
      middleDigit = numString.charAt(chopPoint);
      startSecond++;
  } 
  const firstHalf = numString.substring(0, chopPoint);
  const secondHalf = numString.substring(startSecond);

  return {
    middleDigit, 
    firstHalf,
    secondHalf
  };
}

function returnNextPalindromeNumber(num) {
   let nextPalindrome = num + 1;
   for (let i = nextPalindrome, isPalindrome = false; !isPalindrome ;i++) {
      if (checkIfPalindrome(i.toString())) {
         nextPalindrome = i;
         isPalindrome = true;
      }
   }
   return nextPalindrome;
}

function checkIfPalindrome(str) {
   let isPalindrome = true;
   for (let i = 0, j = str.length - 1; i < j; i++, j--) {
      if (str[i] !== str[j]) {
         isPalindrome = false;
         break;
      }
   }
   return isPalindrome;
}

/*
const result1 =  returnNextPalindromeNumber(123); // 131
const result2 = returnNextPalindromeNumber(4); // 5
const result3 = returnNextPalindromeNumber(1234); // 1331
console.log("123's next palindrome: " + result1);
console.log("4's next palindrome: " + result2);
console.log("1234's next palindrome: " + result3);
*/
const testResult = returnNextPalindromeNumber(test);
console.log(test + "'s next palindrome: " + testResult);

console.log("return next palindrome mathematically")
const tests = [123, 4, 1234, 5431, 63345, 542918434, 100999211];
const solutions = [131, 5, 1331, 5445, 63436, 542919245, 101000101];
tests.forEach((testValue, index) => {
  const actual = returnNextPalindromeMathematically(testValue);
  const expected = solutions[index];
  console.log(`${testValue}'s next palindrome: ${expected}, what was actually returned: ${actual}`)
});