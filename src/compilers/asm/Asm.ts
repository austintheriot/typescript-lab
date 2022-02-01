
import { Test } from 'ts-toolbelt';
import { Add } from '../math/Add';
import { Dec } from '../math/Dec';
import { Inc } from '../math/Inc';
import { Sub } from '../math/Sub';
import { Last } from '../stack/Last';
import { LastN } from '../stack/LastN';
import { Pop } from '../stack/Pop';
import { Replace } from '../stack/Replace';
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
/** Executes the following code block if the last element on the stack is not 0 
 * After executing the block, returns to the beginning of the loop and performs the check again */
type WHILE_START = 'while_start';
type WHILE_END = 'while_end';
/** Executes the following code block if the last element on the stack is not 0 */
type IF_START = 'if_start';
type IF_END = 'if_end';
type VALID_TOKENS = ADD | SUB | PRINT | DROP | DUP | COMMENT_START | COMMENT_END | number | WHILE_START | WHILE_END | IF_START | IF_END;

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
  instructionPointer: number,
  heap: unknown[],
  stack: VALID_TOKENS[],
  output: string,
  debug: boolean,
  /** If last element in this stack is true, indicates that current 
   * code block should be ignored until the end of the if block */
  ignoreIfBlock: boolean[],
  /** If last element is true, indicates that current loop has been broken and 
   * current code block should be ignored until the end of the loop block */
  ignoreWhileBlock: boolean[],
  /** Where the location of the beginning of the while loop is */
  whilePointerStack: number[],
  /** Unload debug information before call stack reaches max */
  calls: number,
}

interface DefaultInterpreterState {
  instructionPointer: 0,
  heap: [],
  stack: [],
  output: "",
  debug: false,
  ignoreIfBlock: [],
  ignoreWhileBlock: [],
  whilePointerStack: [],
  calls: 0,
}

/** Error if not a tuple of tokens */
type ToTokensTuple<T> = T extends VALID_TOKENS[] ? T : never;

/** Error if not a number */
type ToNumber<T> = T extends number ? T : never;

/** Takes a stack of booleans indicating whether a current block should be ignored */
type ShouldExecute<IgnoreStack extends boolean[]> = IgnoreStack['length'] extends 0
  // no blocks to ignore, continue executing
  ? true
  // last block should not be ignored, continue executing
  : Last<IgnoreStack> extends false
  ? true
  : false

type MAX_CALLS = 75;

/** Dumps current state and location of the instructionPointer for easier debugging */
type Dump<Tokens extends VALID_TOKENS[], State extends InterpreterState> = {
  tokens: Tokens,
  state: State,
  currentToken: Tokens[State['instructionPointer']],
}

export type Interpret<Tokens extends VALID_TOKENS[], State extends InterpreterState = DefaultInterpreterState> =
  // no more instructions left to read
  State['instructionPointer'] extends Tokens['length']
  ? State['debug'] extends true ? Dump<Tokens, State> : State['output']

  // internal stack reached
  // dump stack before TypeScript throws an error
  : State['calls'] extends MAX_CALLS
  ? Dump<Tokens, State>

  // IF_END: pop off last ignoreIfBlock element
  : Tokens[State['instructionPointer']] extends IF_END
  ? Interpret<Tokens, {
    stack: State['stack'],
    heap: State['heap'],
    output: State['output'],
    debug: State['debug'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],

    ignoreIfBlock: Pop<State['ignoreIfBlock']>,
    instructionPointer: Inc<State['instructionPointer']>,
    calls: Inc<State['calls']>,
  }>

  // WHILE_END: pop off last ignoreIfBlock element
  // and return to beginning of loop
  : Tokens[State['instructionPointer']] extends WHILE_END
  ? Interpret<Tokens, {
    stack: State['stack'],
    heap: State['heap'],
    output: State['output'],
    debug: State['debug'],
    ignoreIfBlock: State['ignoreIfBlock'],

    instructionPointer: ToNumber<Last<State['whilePointerStack']>>,
    ignoreWhileBlock: Pop<State['ignoreWhileBlock']>,
    whilePointerStack: Pop<State['whilePointerStack']>,
    calls: Inc<State['calls']>,
  }>

  // if block: should execute?
  : ShouldExecute<State['ignoreIfBlock']> extends true ? (

    // while block: should execute?
    ShouldExecute<State['ignoreWhileBlock']> extends true ? (

      // NUMBER
      Tokens[State['instructionPointer']] extends number
      ? Interpret<Tokens, {
        heap: State['heap'],
        output: State['output'],
        debug: State['debug'],
        ignoreIfBlock: State['ignoreIfBlock'],
        ignoreWhileBlock: State['ignoreWhileBlock'],
        whilePointerStack: State['whilePointerStack'],

        instructionPointer: Inc<State['instructionPointer']>,
        stack: [...State['stack'], Tokens[State['instructionPointer']]],
        calls: Inc<State['calls']>,
      }>

      // ADD
      : Tokens[State['instructionPointer']] extends ADD
      ? Interpret<Tokens, {
        heap: State['heap'],
        output: State['output'],
        debug: State['debug'],
        ignoreIfBlock: State['ignoreIfBlock'],
        ignoreWhileBlock: State['ignoreWhileBlock'],
        whilePointerStack: State['whilePointerStack'],

        instructionPointer: Inc<State['instructionPointer']>,
        stack: Replace<State['stack'], 2, [ToNumber<Add<LastN<State['stack'], 1>, LastN<State['stack'], 0>>>]>
        calls: Inc<State['calls']>,
      }>

      // SUB
      : Tokens[State['instructionPointer']] extends SUB
      ? Interpret<Tokens, {
        heap: State['heap'],
        output: State['output'],
        debug: State['debug'],
        ignoreIfBlock: State['ignoreIfBlock'],
        ignoreWhileBlock: State['ignoreWhileBlock'],
        whilePointerStack: State['whilePointerStack'],

        instructionPointer: Inc<State['instructionPointer']>,
        stack: Replace<State['stack'], 2, [ToNumber<Sub<LastN<State['stack'], 1>, LastN<State['stack'], 0>>>]>
        calls: Inc<State['calls']>,
      }>

      // DROP
      : Tokens[State['instructionPointer']] extends DROP
      ? Interpret<Tokens, {
        heap: State['heap'],
        output: State['output'],
        debug: State['debug'],
        ignoreIfBlock: State['ignoreIfBlock'],
        ignoreWhileBlock: State['ignoreWhileBlock'],
        whilePointerStack: State['whilePointerStack'],

        instructionPointer: Inc<State['instructionPointer']>,
        stack: Pop<State['stack']>,
        calls: Inc<State['calls']>,
      }>

      // DUP
      : Tokens[State['instructionPointer']] extends DUP
      ? Interpret<Tokens, {
        heap: State['heap'],
        output: State['output'],
        debug: State['debug'],
        ignoreIfBlock: State['ignoreIfBlock'],
        ignoreWhileBlock: State['ignoreWhileBlock'],
        whilePointerStack: State['whilePointerStack'],

        instructionPointer: Inc<State['instructionPointer']>,
        stack: [...State['stack'], ...ToTokensTuple<[Last<State['stack']>]>],
        calls: Inc<State['calls']>,
      }>

      // PRINT
      : Tokens[State['instructionPointer']] extends PRINT
      ? Interpret<Tokens, {
        heap: State['heap'],
        debug: State['debug'],
        ignoreIfBlock: State['ignoreIfBlock'],
        ignoreWhileBlock: State['ignoreWhileBlock'],
        whilePointerStack: State['whilePointerStack'],

        instructionPointer: Inc<State['instructionPointer']>,
        stack: Pop<State['stack']>
        output: `${State['output']}${State['stack'][Dec<State['stack']['length']>]}`,
        calls: Inc<State['calls']>,
      }>

      // IF START
      : Tokens[State['instructionPointer']] extends IF_START
      ? (
        Last<State['stack']> extends 0
        // skip if block
        ? Interpret<Tokens, {
          heap: State['heap'],
          output: State['output'],
          debug: State['debug'],
          ignoreWhileBlock: State['ignoreWhileBlock'],
          whilePointerStack: State['whilePointerStack'],

          instructionPointer: Inc<State['instructionPointer']>,
          stack: Pop<State['stack']>,
          ignoreIfBlock: [...State['ignoreIfBlock'], true],
          calls: Inc<State['calls']>,
        }>

        // execute if block
        : Interpret<Tokens, {
          heap: State['heap'],
          output: State['output'],
          debug: State['debug'],
          ignoreWhileBlock: State['ignoreWhileBlock'],
          whilePointerStack: State['whilePointerStack'],

          instructionPointer: Inc<State['instructionPointer']>,
          stack: Pop<State['stack']>,
          ignoreIfBlock: [...State['ignoreIfBlock'], false],
          calls: Inc<State['calls']>,
        }>
      )

      // WHILE START
      : Tokens[State['instructionPointer']] extends WHILE_START
      ? (
        Last<State['stack']> extends 0
        // skip while block
        ? Interpret<Tokens, {
          heap: State['heap'],
          output: State['output'],
          debug: State['debug'],
          ignoreIfBlock: State['ignoreIfBlock'],
          whilePointerStack: State['whilePointerStack'],

          instructionPointer: Inc<State['instructionPointer']>,
          stack: Pop<State['stack']>,
          ignoreWhileBlock: [...State['ignoreWhileBlock'], true],
          calls: Inc<State['calls']>,
        }>

        // execute while block
        : Interpret<Tokens, {
          heap: State['heap'],
          output: State['output'],
          debug: State['debug'],
          ignoreIfBlock: State['ignoreIfBlock'],

          instructionPointer: Inc<State['instructionPointer']>,
          stack: Pop<State['stack']>,
          ignoreWhileBlock: [...State['ignoreWhileBlock'], false],
          whilePointerStack: [...State['whilePointerStack'], State['instructionPointer']],
          calls: Inc<State['calls']>,
        }>
      )

      // unexpected token reached: dump current state for debugging
      : Dump<Tokens, State>
    )
    // skip current token in while block
    : Interpret<Tokens, {
      stack: State['stack'],
      heap: State['heap'],
      output: State['output'],
      debug: State['debug'],
      ignoreIfBlock: State['ignoreIfBlock'],
      ignoreWhileBlock: State['ignoreWhileBlock'],
      whilePointerStack: State['whilePointerStack'],

      instructionPointer: Inc<State['instructionPointer']>,
      calls: Inc<State['calls']>,
    }>
  )
  // skip current token in if block
  : Interpret<Tokens, {
    stack: State['stack'],
    heap: State['heap'],
    output: State['output'],
    debug: State['debug'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],

    instructionPointer: Inc<State['instructionPointer']>,
    calls: Inc<State['calls']>,
  }>





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
    instructionPointer: DefaultInterpreterState['instructionPointer'],
    heap: DefaultInterpreterState['heap'],
    output: DefaultInterpreterState['output'],
    stack: DefaultInterpreterState['stack'],
    ignoreIfBlock: DefaultInterpreterState['ignoreIfBlock'],
    ignoreWhileBlock: DefaultInterpreterState['ignoreWhileBlock'],
    whilePointerStack: DefaultInterpreterState['whilePointerStack'],
    calls: DefaultInterpreterState['calls'],
  }>['state']['stack'], [1], Test.Pass>(),

  // DUP
  check<Interpret<[1, 2, DUP], {
    debug: true,
    instructionPointer: DefaultInterpreterState['instructionPointer'],
    heap: DefaultInterpreterState['heap'],
    output: DefaultInterpreterState['output'],
    stack: DefaultInterpreterState['stack'],
    ignoreIfBlock: DefaultInterpreterState['ignoreIfBlock'],
    ignoreWhileBlock: DefaultInterpreterState['ignoreWhileBlock'],
    whilePointerStack: DefaultInterpreterState['whilePointerStack'],
    calls: DefaultInterpreterState['calls'],
  }>['state']['stack'], [1, 2, 2], Test.Pass>(),


  // COMBINATIONS OF (NON-BRANCHING) INSTRUCTIONS
  check<Interpret<[10, 1, SUB, 5, ADD, DUP, PRINT, 2, ADD, PRINT]>, "1416", Test.Pass>(),

  // IF (EXECUTE)
  check<Interpret<[1, IF_START, 1000, PRINT, IF_END, 2, PRINT], {
    debug: true,
    instructionPointer: DefaultInterpreterState['instructionPointer'],
    heap: DefaultInterpreterState['heap'],
    output: DefaultInterpreterState['output'],
    stack: DefaultInterpreterState['stack'],
    ignoreIfBlock: DefaultInterpreterState['ignoreIfBlock'],
    ignoreWhileBlock: DefaultInterpreterState['ignoreWhileBlock'],
    whilePointerStack: DefaultInterpreterState['whilePointerStack'],
    calls: DefaultInterpreterState['calls'],
  }>['state']['output'], "10002", Test.Pass>(),

  // IF (SKIP)
  check<Interpret<[0, IF_START, 1000, PRINT, IF_END, 2, PRINT], {
    debug: true,
    instructionPointer: DefaultInterpreterState['instructionPointer'],
    heap: DefaultInterpreterState['heap'],
    output: DefaultInterpreterState['output'],
    stack: DefaultInterpreterState['stack'],
    ignoreIfBlock: DefaultInterpreterState['ignoreIfBlock'],
    ignoreWhileBlock: DefaultInterpreterState['ignoreWhileBlock'],
    whilePointerStack: DefaultInterpreterState['whilePointerStack'],
    calls: DefaultInterpreterState['calls'],
  }>['state']['output'], "2", Test.Pass>(),

  // IF (NESTED)
  check<Interpret<[1, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>, "100010012", Test.Pass>(),
  check<Interpret<[1, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>, "10002", Test.Pass>(),
  check<Interpret<[0, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>, "2", Test.Pass>(),
  check<Interpret<[0, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>, "2", Test.Pass>(),

  // LOOP (ONCE)
  check<Interpret<[1, WHILE_START, 1, PRINT, 0, WHILE_END]>, "1", Test.Pass>(),

  // INFINITE LOOP (INTERNAL MAX CALLS REACHED)
  check<Interpret<[1, WHILE_START, 1, PRINT, 1, WHILE_END]>['state']['output'], "111111111111111", Test.Pass>(),
]);
