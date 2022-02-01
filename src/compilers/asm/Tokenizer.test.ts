
import { Test } from 'ts-toolbelt';
import { Tokenizer } from './Tokenizer';
import { ADD } from './Tokens';
const { checks, check } = Test;

checks([
  // ADD
  check<Tokenizer<'add'>['state']['tokens'], [ADD], Test.Pass>(),

  // COMMENT BLOCKS
  check<Tokenizer<'/* */ add'>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenizer<'/* add */ add'>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenizer<'/* Hello! This is a comment block */ add'>['state']['tokens'], [ADD], Test.Pass>(),

  // NUMBERS
  check<Tokenizer<`/* */ (1)`>['state']['tokens'], [1], Test.Pass>(),
  check<Tokenizer<'/* 1 */ (1)'>['state']['tokens'], [1], Test.Pass>(),
  check<Tokenizer<'/* Hello! This is a comment block */ (1)'>['state']['tokens'], [1], Test.Pass>(),

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