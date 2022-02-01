
import { First } from 'src/older/First';
import { Test } from 'ts-toolbelt';
import { Add } from '../math/Add';
import { Dec } from '../math/Dec';
import { LastN } from '../stack/LastN';
import { Pop } from '../stack/Pop';
import { Push } from '../stack/Push';
import { Replace } from '../stack/Replace';
import { Shift } from '../stack/Shift';
const { checks, check } = Test;

// ignored tokens (all others are considered errors)
type SPACE = " ";
type NEWLINE = "\n";
type IGNORED_TOKENS = SPACE | NEWLINE;

// valid tokens
type ADD = 'add';
type PRINT = 'print';
type COMMENT_START = "/*";
type COMMENT_END = "*/";
type VALID_TOKENS = ADD | PRINT | COMMENT_START | COMMENT_END | number;

interface TokenizerState {
  tokens: VALID_TOKENS[],
  error: string,
}

type TokenizerDefaultState = {
  tokens: [],
  error: "",
};

/** Translated Tokens directly into a callable call tokens */
export type Tokenizer<Source extends string, State extends TokenizerState = TokenizerDefaultState> =
  Source extends ""
  ? State

  // ADD
  : Source extends `${ADD}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], ADD],
  }>

  // COMMENT: ignore comment
  : Source extends `${COMMENT_START}${infer _COMMENT_BLOCK}${COMMENT_END}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: State['tokens'],
  }>

  // NON-VALID TOKENS
  : Source extends `${infer Ch}${infer Rest}`
  ? (
    // character is a number
    Ch extends number
    ? Tokenizer<Rest, {
      error: State['error'],
      tokens: State['tokens'],
    }>

    // ignore and continue
    : Ch extends IGNORED_TOKENS
    ? Tokenizer<Rest, {
      error: State['error'],
      tokens: State['tokens'],
    }>

    //illegal token: halt and output error
    : {
      error: `${State['error']}
      Error: illegal character found: ${Ch}`,
      tokens: State['tokens'],
    }
  )

  : never;


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


interface InterpreterState {
  heap: unknown[],
  stack: VALID_TOKENS[],
  output: string,
}

interface DefaultInterpreterState {
  heap: [],
  stack: [],
  output: "",
}

/** Error if not a tuple of tokens */
type ToTokensTuple<T> = T extends VALID_TOKENS[] ? T : never;

/** Error if not a number */
type ToNumber<T> = T extends number ? T : never;

// INTERPRETER MUST ITERATE THROUGH TOKENS AND GENERATE STACK SEPARATELY
export type Interpret<Tokens extends VALID_TOKENS[], State extends InterpreterState = DefaultInterpreterState> =
  // no more instructions on the stack
  Tokens['length'] extends 0
  ? State['output']

  // NUMBER
  : First<Tokens> extends number
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Push<State['stack'], First<Tokens>>
    heap: State['heap'],
    output: State['output'],
  }>

  // ADD
  : First<Tokens> extends ADD
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Replace<State['stack'], 2, [ToNumber<Add<LastN<State['stack'], 1>, LastN<State['stack'], 0>>>]>
    heap: State['heap'],
    output: State['output'],
  }>

  // PRINT
  : First<Tokens> extends PRINT
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Pop<State['stack']>
    heap: State['heap'],
    output: `${State['output']}${State['stack'][Dec<State['stack']['length']>]}`,
  }>

  // debugging
  : {
    stack: Tokens,
    state: State,
      }


checks([
  // ADD
  check<Interpret<[1, 2, ADD, 5, ADD, PRINT]>, "8", Test.Pass>(),

  // PRINT
  check<Interpret<[1, PRINT]>, "1", Test.Pass>(),
  check<Interpret<[1, PRINT, 2, PRINT]>, "12", Test.Pass>(),
]);
