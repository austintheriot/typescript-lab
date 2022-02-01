
import { First } from 'src/older/First';
import { Test } from 'ts-toolbelt';
import { Add } from '../math/Add';
import { Dec } from '../math/Dec';
import { Sub } from '../math/Sub';
import { Last } from '../stack/Last';
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
/** Add last 2 elements on the stack together */
type ADD = 'add';
/** Subtract last element on the stack from the second to last element */
type SUB = 'sub';
/** Print out the last element on the stack to output */
type PRINT = 'print';
/** Drop the last element on the stack */
type DROP = 'drop';
/** Duplicate the last element on the stack */
type DUP = 'dup';
type COMMENT_START = "/*";
type COMMENT_END = "*/";
type VALID_TOKENS = ADD | SUB | PRINT | DROP  | DUP | COMMENT_START | COMMENT_END | number;

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
  debug: boolean,
}

interface DefaultInterpreterState {
  heap: [],
  stack: [],
  output: "",
  debug: false,
}

/** Error if not a tuple of tokens */
type ToTokensTuple<T> = T extends VALID_TOKENS[] ? T : never;

/** Error if not a number */
type ToNumber<T> = T extends number ? T : never;

// INTERPRETER MUST ITERATE THROUGH TOKENS AND GENERATE STACK SEPARATELY
export type Interpret<Tokens extends VALID_TOKENS[], State extends InterpreterState = DefaultInterpreterState> =
  // no more instructions on the stack
  Tokens['length'] extends 0
  ? State['debug'] extends true ? State : State['output']

  // NUMBER
  : First<Tokens> extends number
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Push<State['stack'], First<Tokens>>
    heap: State['heap'],
    output: State['output'],
    debug: State['debug'],
  }>

  // ADD
  : First<Tokens> extends ADD
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Replace<State['stack'], 2, [ToNumber<Add<LastN<State['stack'], 1>, LastN<State['stack'], 0>>>]>
    heap: State['heap'],
    output: State['output'],
    debug: State['debug'],
  }>

  // SUB
  : First<Tokens> extends SUB
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Replace<State['stack'], 2, [ToNumber<Sub<LastN<State['stack'], 1>, LastN<State['stack'], 0>>>]>
    heap: State['heap'],
    output: State['output'],
    debug: State['debug'],
  }>

  // DROP
  : First<Tokens> extends DROP
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Pop<State['stack']>,
    heap: State['heap'],
    output: State['output'],
    debug: State['debug'],
  }>

  // DUP
  : First<Tokens> extends DUP
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Push<State['stack'], ToNumber<Last<State['stack']>>>,
    heap: State['heap'],
    output: State['output'],
    debug: State['debug'],
  }>

  // PRINT
  : First<Tokens> extends PRINT
  ? Interpret<ToTokensTuple<Shift<Tokens>>, {
    stack: Pop<State['stack']>
    heap: State['heap'],
    output: `${State['output']}${State['stack'][Dec<State['stack']['length']>]}`,
    debug: State['debug'],
  }>

  // debugging
  : {
    stack: Tokens,
    state: State,
  }


checks([
  // PRINT
  check<Interpret<[1, PRINT]>, "1", Test.Pass>(),
  check<Interpret<[1, PRINT, 2, PRINT]>, "12", Test.Pass>(),

  // ADD
  check<Interpret<[1, 2, ADD, PRINT]>, "3", Test.Pass>(),
  check<Interpret<[1, 2, ADD, 5, ADD, PRINT]>, "8", Test.Pass>(),

  // SUB
  check<Interpret<[3, 2, SUB, PRINT]>, "1", Test.Pass>(),
  check<Interpret<[10, 1, SUB, 5, SUB, PRINT]>, "4", Test.Pass>(),

  // DROP
  check<Interpret<[1, 2, DROP], {
    debug: true,
    heap: DefaultInterpreterState['heap'],
    output: DefaultInterpreterState['output'],
    stack: DefaultInterpreterState['stack'],
  }>['stack'], [1], Test.Pass>(),

  // DROP
  check<Interpret<[1, 2, DUP], {
    debug: true,
    heap: DefaultInterpreterState['heap'],
    output: DefaultInterpreterState['output'],
    stack: DefaultInterpreterState['stack'],
  }>['stack'], [1, 2, 2], Test.Pass>(),

  // COMBINATIONS OF INSTRUCTIONS
  check<Interpret<[10, 1, SUB, 5, ADD, DUP, PRINT, 2, ADD, PRINT]>, "1416", Test.Pass>(),
]);
