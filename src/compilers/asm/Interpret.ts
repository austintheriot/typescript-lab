
import { And } from '../logic/gates';
import { Add } from '../math/Add';
import { Dec } from '../math/Dec';
import { Gt } from '../math/Gt';
import { Gte } from '../math/Gte';
import { Lt } from '../math/Lt';
import { Lte } from '../math/Lte';
import { Eq } from '../math/Eq';
import { Neq } from '../math/Neq';
import { Inc } from '../math/Inc';
import { Sub } from '../math/Sub';
import { U8Add } from '../math/U8Add';
import { U8Sub } from '../math/U8Sub';
import { Swap } from '../memory/Swap';
import { Write } from '../memory/Write';
import { Last } from '../stack/Last';
import { LastN } from '../stack/LastN';
import { Pop } from '../stack/Pop';
import { PopN } from '../stack/PopN';
import { Replace } from '../stack/Replace';
import {
  ADD, DROP, DUP, GT, GTE, IF_END, IF_START, PRINT, READ, SUB, SWAP,
  U8_ADD, U8_SUB, VALID_TOKENS, WHILE_END, WHILE_START, WRITE, LT, LTE,
  EQ, NEQ,
} from './Tokens';

export interface InterpreterState {
  instructionPointer: number,
  heap: number[],
  stack: number[],
  output: string,
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
  /** Stick an arbitrary value in here to debug */
  debugValue: unknown,
  maxCalls: number,
}

export interface DefaultInterpreterState {
  instructionPointer: 0,
  /** 10 to start with */
  heap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  stack: [],
  output: "",
  ignoreIfBlock: [],
  ignoreWhileBlock: [],
  whilePointerStack: [],
  calls: 0,
  debugValue: null,
  /** Dump output before TypeScript throws error for excessively deep recursion */
  maxCalls: 500,
}

export type DefaultWithOverwrite<Overwrite> = Omit<DefaultInterpreterState, keyof Overwrite> & Overwrite;

/** Error if not a tuple of tokens */
type ToTokensTuple<T> = T extends VALID_TOKENS[] ? T : never;
type ToNumberTuple<T> = T extends number[] ? T : never;

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

/** Dumps current state and location of the instructionPointer for easier debugging */
type Dump<Tokens extends VALID_TOKENS[], State extends InterpreterState> = {
  tokens: Tokens,
  state: State,
  currentToken: Tokens[State['instructionPointer']],
}

export type Interpret<Tokens extends VALID_TOKENS[], State extends InterpreterState = DefaultInterpreterState> =
  // no more instructions left to read
  State['instructionPointer'] extends Tokens['length']
  ? Dump<Tokens, State>

  // internal stack reached
  // dump stack before TypeScript throws an error
  : State['calls'] extends State['maxCalls']
  ? Dump<Tokens, State>

  // IF_END: pop off last ignoreIfBlock element
  : Tokens[State['instructionPointer']] extends IF_END
  ? Interpret<Tokens, {
    stack: State['stack'],
    heap: State['heap'],
    output: State['output'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

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
    ignoreIfBlock: State['ignoreIfBlock'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

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
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    calls: Inc<State['calls']>,
  }>

  // NUMBER
  : Tokens[State['instructionPointer']] extends number
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: [...State['stack'], Tokens[State['instructionPointer']]],
    calls: Inc<State['calls']>,
  }>

  // U8_ADD
  : Tokens[State['instructionPointer']] extends U8_ADD
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [U8Add<LastN<State['stack'], 1>, LastN<State['stack'], 0>>]>
    calls: Inc<State['calls']>,
  }>

  // U8_SUB
  : Tokens[State['instructionPointer']] extends U8_SUB
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [U8Sub<LastN<State['stack'], 1>, LastN<State['stack'], 0>>]>
    calls: Inc<State['calls']>,
  }>

  // ADD
  : Tokens[State['instructionPointer']] extends ADD
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [ToNumber<Add<LastN<State['stack'], 1>, LastN<State['stack'], 0>>>]>
    calls: Inc<State['calls']>,
  }>

  // SUB
  : Tokens[State['instructionPointer']] extends SUB
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [ToNumber<Sub<LastN<State['stack'], 1>, LastN<State['stack'], 0>>>]>
    calls: Inc<State['calls']>,
  }>

  // DROP
  : Tokens[State['instructionPointer']] extends DROP
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Pop<State['stack']>,
    calls: Inc<State['calls']>,
  }>

  // DUP
  : Tokens[State['instructionPointer']] extends DUP
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: [...State['stack'], ToNumber<Last<State['stack']>>],
    calls: Inc<State['calls']>,
  }>

  // PRINT
  : Tokens[State['instructionPointer']] extends PRINT
  ? Interpret<Tokens, {
    heap: State['heap'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Pop<State['stack']>
    output: `${State['output']}${State['stack'][Dec<State['stack']['length']>]}`,
    calls: Inc<State['calls']>,
  }>

  // WRITE
  : Tokens[State['instructionPointer']] extends WRITE
  ? Interpret<Tokens, {
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    output: State['output'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    heap: ToNumberTuple<Write<State['heap'], LastN<State['stack'], 0> /* index */, LastN<State['stack'], 1 /* value */>>>,
    instructionPointer: Inc<State['instructionPointer']>,
    stack: PopN<State['stack'], 2>
    calls: Inc<State['calls']>,
  }>

  // SWAP
  : Tokens[State['instructionPointer']] extends SWAP
  ? Interpret<Tokens, {
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    output: State['output'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    heap: ToNumberTuple<Swap<State['heap'], LastN<State['stack'], 1>, LastN<State['stack'], 0>>>,
    instructionPointer: Inc<State['instructionPointer']>,
    stack: PopN<State['stack'], 2>
    calls: Inc<State['calls']>,
  }>

  // READ
  : Tokens[State['instructionPointer']] extends READ
  ? Interpret<Tokens, {
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    output: State['output'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    heap: State['heap'],
    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 1, [ToNumber<State['heap'][ToNumber<Last<State['stack']>>]>]>,
    calls: Inc<State['calls']>,
  }>

  // IF START (IGNORE)
  : [Tokens[State['instructionPointer']], Last<State['stack']>] extends [IF_START, 0]
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

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
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

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
    ignoreIfBlock: State['ignoreIfBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

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
    ignoreIfBlock: State['ignoreIfBlock'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Pop<State['stack']>,
    ignoreWhileBlock: [...State['ignoreWhileBlock'], false],
    whilePointerStack: [...State['whilePointerStack'], State['instructionPointer']],
    calls: Inc<State['calls']>,
  }>

  // GT
  : Tokens[State['instructionPointer']] extends GT
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [Gt<LastN<State['stack'], 1>, ToNumber<Last<State['stack']>>>]>
    calls: Inc<State['calls']>,
  }>

  // GTE
  : Tokens[State['instructionPointer']] extends GTE
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [Gte<LastN<State['stack'], 1>, ToNumber<Last<State['stack']>>>]>
    calls: Inc<State['calls']>,
  }>

  // LT
  : Tokens[State['instructionPointer']] extends LT
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [Lt<LastN<State['stack'], 1>, ToNumber<Last<State['stack']>>>]>
    calls: Inc<State['calls']>,
  }>

  // LTE
  : Tokens[State['instructionPointer']] extends LTE
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [Lte<LastN<State['stack'], 1>, ToNumber<Last<State['stack']>>>]>
    calls: Inc<State['calls']>,
  }>

  // EQ
  : Tokens[State['instructionPointer']] extends EQ
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [Eq<LastN<State['stack'], 1>, ToNumber<Last<State['stack']>>>]>
    calls: Inc<State['calls']>,
  }>

  // NEQ
  : Tokens[State['instructionPointer']] extends NEQ
  ? Interpret<Tokens, {
    heap: State['heap'],
    output: State['output'],
    ignoreIfBlock: State['ignoreIfBlock'],
    ignoreWhileBlock: State['ignoreWhileBlock'],
    whilePointerStack: State['whilePointerStack'],
    debugValue: State['debugValue'],
    maxCalls: State['maxCalls'],

    instructionPointer: Inc<State['instructionPointer']>,
    stack: Replace<State['stack'], 2, [Neq<LastN<State['stack'], 1>, ToNumber<Last<State['stack']>>>]>
    calls: Inc<State['calls']>,
  }>

  // unexpected token reached: dump current state for debugging
  : Dump<Tokens, State>;