
import { Test } from 'ts-toolbelt';
import { Tokenizer } from './Tokenizer';
import { ADD } from './Tokens';
const { checks, check } = Test;

checks([
  // ADD
  check<Tokenizer<'add'>['tokens'], [ADD], Test.Pass>(),

  // COMMENT BLOCKS
  check<Tokenizer<'/* */ add'>['tokens'], [ADD], Test.Pass>(),
  check<Tokenizer<'/* add */ add'>['tokens'], [ADD], Test.Pass>(),
  check<Tokenizer<'/* Hello! This is a comment block */ add'>['tokens'], [ADD], Test.Pass>(),

  // NUMBERS
  // TODO

  // NON-VALID TOKENS (IGNORED)
  check<Tokenizer<`
                  
 `>, {
    tokens: [],
    error: "",
  }, Test.Pass>(),
  check<Tokenizer<`
   Example of illegal input
 `>['error'], "", Test.Fail>(),

  // NON-VALID TOKENS (ERRORS)
  check<Tokenizer<`
    Example of illegal input
  `>['tokens'], [], Test.Pass>(),
  check<Tokenizer<`
    Example of illegal input
  `>['error'], "", Test.Fail>(),
]);