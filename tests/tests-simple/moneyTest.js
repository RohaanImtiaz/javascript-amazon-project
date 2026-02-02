import formatCurrency from '../../scripts/utils/money.js';

console.log('test suite: format currency'); // This is called a test suite

console.log('converts cents into dollars'); // The code ... (does this)
const test1 = (formatCurrency(2095) === '20.95') ? 'passed' : 'failed'; // Basic test case
console.log(test1);

console.log('works with 0'); // These are called test cases
const test2 = (formatCurrency(0) === '0.00') ? 'passed' : 'failed'; // Edge test case
console.log(test2);

console.log('rounds up to the nearest cent');
const test3 = (formatCurrency(2000.5) === '20.01') ? 'passed' : 'failed'; // Edge test case
console.log(test3);