
import { Test } from 'ts-toolbelt';
import { Tokenize } from './Tokenize';
import { ADD, DROP, DUP, IF_END, IF_START, PRINT, SUB, WHILE_END, WHILE_START } from './Tokens';
const { checks, check } = Test;

checks([
  // ADD
  check<Tokenize<'add'>['state']['tokens'], [ADD], Test.Pass>(),

  // SUB
  check<Tokenize<'sub'>['state']['tokens'], [SUB], Test.Pass>(),

   // DUP
  check<Tokenize<'dup'>['state']['tokens'], [DUP], Test.Pass>(),
   
   // DROP
  check<Tokenize<'drop'>['state']['tokens'], [DROP], Test.Pass>(),
   
   // PRINT
  check<Tokenize<'print'>['state']['tokens'], [PRINT], Test.Pass>(),
   
   // IF_START
  check<Tokenize<'if_start'>['state']['tokens'], [IF_START], Test.Pass>(),
   
   // IF_END
  check<Tokenize<'if_end'>['state']['tokens'], [IF_END], Test.Pass>(),
   
   // WHILE_START
  check<Tokenize<'while_start'>['state']['tokens'], [WHILE_START], Test.Pass>(),
   
   // WHILE_END
  check<Tokenize<'while_end'>['state']['tokens'], [WHILE_END], Test.Pass>(),

  // MULTI-LINE COMMENT
  check<Tokenize<'/* */ add'>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenize<'/* add */ add'>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenize<'/* Hello! This is a comment block */ add'>['state']['tokens'], [ADD], Test.Pass>(),

  // SINGLE-LINE COMMENT
  check<Tokenize<'// this is a single comment'>['state']['tokens'], [], Test.Pass>(),
  check<Tokenize<'add // this is a single comment'>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenize<`add // this is a comment
    sub // this is ignored
    `>['state']['tokens'], [ADD, SUB], Test.Pass>(),

  // NUMBERS
  check<Tokenize<`/* */ (1)`>['state']['tokens'], [1], Test.Pass>(),
  check<Tokenize<'/* 1 */ (1)'>['state']['tokens'], [1], Test.Pass>(),
  check<Tokenize<'/* Hello! This is a comment block */ (1)'>['state']['tokens'], [1], Test.Pass>(),


  // COMBINATIONS OF TOKENS
  check<Tokenize<`
  /* This is an example of a multiline comment block.
  It should be ignored by the tokenizer */ 

  (999) // << to the left is a number (but this is a comment and is ignored)
  (1)
  add
  (10)
  sub
  print

  /* 
  
  Another comment block that is ignored 

  Weeeee! I can write anything I want to here.
  
  
  */

  (500)
  dup
  drop
  (1)
  if_start
  if_end
  (1)
  while_start
  while_end
  

  // more useless comments :)
  `>['state']['tokens'], [999, 1, ADD, 10, SUB, PRINT, 500, DUP, DROP, 1, IF_START, IF_END, 1, WHILE_START, WHILE_END], Test.Pass>(),

  // NON-VALID TOKENS (IGNORED)
  check<Tokenize<`
                  
 `>['state'], {
    tokens: [],
    error: "",
    }, Test.Pass>(),
  
  
  // NON-VALID TOKENS (ERRORS)
  check<Tokenize<`
    Example of illegal input
  `>['state']['tokens'], [], Test.Pass>(),
  check<Tokenize<`
    Example of illegal input
  `>['state']['error'], "", Test.Fail>(),
]);