
import { Test } from 'ts-toolbelt';
import { Tokenizer } from './Tokenizer';
import { ADD, DROP, DUP, IF_END, IF_START, PRINT, SUB, WHILE_END, WHILE_START } from './Tokens';
const { checks, check } = Test;

checks([
  // ADD
  check<Tokenizer<'add'>['state']['tokens'], [ADD], Test.Pass>(),

  // SUB
  check<Tokenizer<'sub'>['state']['tokens'], [SUB], Test.Pass>(),

   // DUP
  check<Tokenizer<'dup'>['state']['tokens'], [DUP], Test.Pass>(),
   
   // DROP
  check<Tokenizer<'drop'>['state']['tokens'], [DROP], Test.Pass>(),
   
   // PRINT
  check<Tokenizer<'print'>['state']['tokens'], [PRINT], Test.Pass>(),
   
   // IF_START
  check<Tokenizer<'if_start'>['state']['tokens'], [IF_START], Test.Pass>(),
   
   // IF_END
  check<Tokenizer<'if_end'>['state']['tokens'], [IF_END], Test.Pass>(),
   
   // WHILE_START
  check<Tokenizer<'while_start'>['state']['tokens'], [WHILE_START], Test.Pass>(),
   
   // WHILE_END
  check<Tokenizer<'while_end'>['state']['tokens'], [WHILE_END], Test.Pass>(),

  // COMMENT BLOCKS
  check<Tokenizer<'/* */ add'>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenizer<'/* add */ add'>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenizer<'/* Hello! This is a comment block */ add'>['state']['tokens'], [ADD], Test.Pass>(),

  // NUMBERS
  check<Tokenizer<`/* */ (1)`>['state']['tokens'], [1], Test.Pass>(),
  check<Tokenizer<'/* 1 */ (1)'>['state']['tokens'], [1], Test.Pass>(),
  check<Tokenizer<'/* Hello! This is a comment block */ (1)'>['state']['tokens'], [1], Test.Pass>(),


  // COMBINATIONS OF TOKENS
  check<Tokenizer<`
  /* This is an example of a multiline comment block.
  It should be ignored by the tokenizer */ 

  (999)
  (1)
  add
  (10)
  sub
  print
  (500)
  dup
  drop
  (1)
  if_start
  if_end
  (1)
  while_start
  while_end
  
  `>['state']['tokens'], [999, 1, ADD, 10, SUB, PRINT, 500, DUP, DROP, 1, IF_START, IF_END, 1, WHILE_START, WHILE_END], Test.Pass>(),

  // NON-VALID TOKENS (IGNORED)
  check<Tokenizer<`
                  
 `>['state'], {
    tokens: [],
    error: "",
    }, Test.Pass>(),
  
  
  // NON-VALID TOKENS (ERRORS)
  check<Tokenizer<`
    Example of illegal input
  `>['state']['tokens'], [], Test.Pass>(),
  check<Tokenizer<`
    Example of illegal input
  `>['state']['error'], "", Test.Fail>(),
]);