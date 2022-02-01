
import { And } from '../logic/gates';
import { Add } from '../math/Add';
import { Dec } from '../math/Dec';
import { Inc } from '../math/Inc';
import { Sub } from '../math/Sub';
import { Last } from '../stack/Last';
import { LastN } from '../stack/LastN';
import { Pop } from '../stack/Pop';
import { Replace } from '../stack/Replace';
import { ADD, DROP, DUP, IF_END, IF_START, PRINT, SUB, VALID_TOKENS, WHILE_END, WHILE_START } from './Tokens';

export interface InterpreterState {
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

export interface DefaultInterpreterState {
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

type MAX_CALLS = 80;

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

  // SKIPPING IF/WHILE BLOCK
  : And<ShouldExecute<State['ignoreIfBlock']>, ShouldExecute<State['ignoreWhileBlock']>> extends false
  ? Interpret<Tokens, {
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

  // NUMBER
  : Tokens[State['instructionPointer']] extends number
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

  // IF START (IGNORE)
  : [Tokens[State['instructionPointer']], Last<State['stack']>] extends [IF_START, 0]
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

  // IF START (EXECUTE)
  : [Tokens[State['instructionPointer']], Last<State['stack']>] extends [IF_START, number]
  ? Interpret<Tokens, {
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

  // WHILE START (IGNORE)
  : [Tokens[State['instructionPointer']], Last<State['stack']>] extends [WHILE_START, 0]
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

  // WHILE START (EXECUTE)
  : [Tokens[State['instructionPointer']], Last<State['stack']>] extends [WHILE_START, number]
  ? Interpret<Tokens, {
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
  
  // unexpected token reached: dump current state for debugging
  : Dump<Tokens, State>;