
import { Test } from 'ts-toolbelt';
import { Interpret } from './Interpret';
import { Tokenize } from './Tokenize';
const { checks, check } = Test;

type Source = `
/**
 * Prints out the 7654321 to the output using a while loop
 * that iterates 7 times, decrementing a counter from linear memory
 * on each iteration.
 */

// write 5 into linear memory at index 0
(7)
(0)
write

// start while loop
(1)
while_start

// print value at memory index 0
(0)
read

// duplicate the value the new value, so that it's on the top of the
// stack for when we decrement it in a second
dup
print

// subtract 1 from the value at memory index 0
(1)
sub
// duplicate the new value, so that it's on the top of the
// stack for the next iteration of the while loop
dup
// write the new value into linear memory
(0)
write

while_end
`;

type Tokens = Tokenize<Source>['state']['tokens'];
type Output = Interpret<Tokens>;
checks([
  check<Output['state']['output'], "7654321", Test.Pass>(),
]);
