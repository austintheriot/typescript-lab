
import { Test } from 'ts-toolbelt';
import { Interpret } from './Interpret';
import { Tokenize } from './Tokenize';
const { checks, check } = Test;

type Source = `
/* Prints out the 432 to the output using a while loop, 
 * decrementing a counter from linear memory on each iteration. 
 * If the value is greater than 1, it prints, else the loop continues */

// write 4 into linear memory at index 0
(4)
(0)
write

// start while loop
(1)
while_start

// print value at memory index 0 if the value is greater than 1
(0)
read
dup // saving this read value for print and subtracting later
dup
(1)
gt
if_start
print
if_end

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
  check<Output['state']['output'], "432", Test.Pass>(),
]);
