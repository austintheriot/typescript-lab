
import { Test } from 'ts-toolbelt';
import { DefaultInterpreterState, Interpret } from './Interpret';
import {
  ADD, DROP, DUP, IF_END, IF_START, PRINT, READ, SUB, SWAP,
  WHILE_END, WHILE_START, WRITE, U8_ADD, U8_SUB, GT, GTE, LT, LTE,
  EQ, NEQ,
} from './Tokens';
const { checks, check } = Test;

type DefaultWithOverwrite<Overwrite> = Omit<DefaultInterpreterState, keyof Overwrite> & Overwrite;

checks([
  // PRINT
  check<Interpret<[1, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[1, PRINT, 2, PRINT]>['state']['output'], "12", Test.Pass>(),

  // ADD
  check<Interpret<[1, 2, ADD, PRINT]>['state']['output'], "3", Test.Pass>(),
  check<Interpret<[1, 2, ADD, 5, ADD, PRINT]>['state']['output'], "8", Test.Pass>(),
  check<Interpret<[400, 100, ADD, 5, ADD, PRINT]>['state']['output'], "505", Test.Pass>(),

  // GT
  check<Interpret<[1, 2, GT, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[2, 1, GT, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[1, 1, GT, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[100, 99, GT, PRINT]>['state']['output'], "1", Test.Pass>(),

  // GTE
  check<Interpret<[1, 2, GTE, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[2, 1, GTE, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[1, 1, GTE, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[100, 99, GTE, PRINT]>['state']['output'], "1", Test.Pass>(),

  // LT
  check<Interpret<[1, 2, LT, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[2, 1, LT, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[1, 1, LT, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[99, 100, LT, PRINT]>['state']['output'], "1", Test.Pass>(),

  // LTE
  check<Interpret<[2, 1, LTE, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[1, 2, LTE, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[1, 1, LTE, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[99, 100, LTE, PRINT]>['state']['output'], "1", Test.Pass>(),

  // EQ
  check<Interpret<[2, 1, EQ, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[1, 2, EQ, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[1, 1, EQ, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[99, 100, EQ, PRINT]>['state']['output'], "0", Test.Pass>(),

  // NEQ
  check<Interpret<[2, 1, NEQ, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[1, 2, NEQ, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[1, 1, NEQ, PRINT]>['state']['output'], "0", Test.Pass>(),
  check<Interpret<[99, 100, NEQ, PRINT]>['state']['output'], "1", Test.Pass>(),

  // SUB
  check<Interpret<[3, 2, SUB, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[10, 1, SUB, 5, SUB, PRINT]>['state']['output'], "4", Test.Pass>(),
  check<Interpret<[400, 200, SUB, 5, SUB, PRINT]>['state']['output'], "195", Test.Pass>(),

  // U8_ADD
  check<Interpret<[1, 2, U8_ADD, PRINT]>['state']['output'], "3", Test.Pass>(),
  check<Interpret<[1, 2, U8_ADD, 5, U8_ADD, PRINT]>['state']['output'], "8", Test.Pass>(),
  check<Interpret<[255, 1, U8_ADD, PRINT]>['state']['output'], "0", Test.Pass>(),
  // undefined behavior: one operand is too large
  check<Interpret<[400, 100, U8_ADD, 5, U8_ADD, PRINT]>['state']['output'], string, Test.Pass>(),

  // U8_SUB
  check<Interpret<[0, 1, U8_SUB, PRINT]>['state']['output'], "255", Test.Pass>(),
  check<Interpret<[3, 2, U8_SUB, PRINT]>['state']['output'], "1", Test.Pass>(),
  check<Interpret<[10, 1, U8_SUB, 5, U8_SUB, PRINT]>['state']['output'], "4", Test.Pass>(),
  // undefined behavior: one operand is too large
  check<Interpret<[300, 1, U8_SUB, 5, U8_SUB, PRINT]>['state']['output'], string, Test.Pass>(),

  // DROP
  check<Interpret<[1, 2, DROP], DefaultInterpreterState>['state']['stack'], [1], Test.Pass>(),

  // DUP
  check<Interpret<[1, 2, DUP], DefaultInterpreterState>['state']['stack'], [1, 2, 2], Test.Pass>(),

  // WRITE
  check<Interpret<[2, 1, WRITE], DefaultInterpreterState>['state']['heap'], [0, 2, 0, 0, 0, 0, 0, 0, 0, 0], Test.Pass>(),
  check<Interpret<[999, 8, WRITE], DefaultInterpreterState>['state']['heap'], [0, 0, 0, 0, 0, 0, 0, 0, 999, 0], Test.Pass>(),
  // out of bounds index
  check<Interpret<[2, 11, WRITE], DefaultInterpreterState>['state']['heap'], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], Test.Pass>(),

  // SWAP
  check<Interpret<[1, 2, SWAP], DefaultWithOverwrite<{
    debug: true,
    heap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  }>>['state']['heap'], [0, 2, 1, 3, 4, 5, 6, 7, 8, 9], Test.Pass>(),
  check<Interpret<[9, 8, SWAP], DefaultWithOverwrite<{
    debug: true,
    heap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  }>>['state']['heap'], [0, 1, 2, 3, 4, 5, 6, 7, 9, 8], Test.Pass>(),
  // error on out of bounds index (since it introduces `undefined` into the heap, which is not a number)
  check<Interpret<[10, 2, SWAP], DefaultWithOverwrite<{
    debug: true,
    heap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  }>>['state']['heap'], never, Test.Pass>(),

  // READ
  check<Interpret<[1, READ], DefaultWithOverwrite<{
    debug: true,
    heap: [9, 8, 7, 6, 5, 4, 3, 2, 1],
  }>>['state']['stack'], [8], Test.Pass>(),
  check<Interpret<[8, READ], DefaultWithOverwrite<{
    debug: true,
    heap: [9, 8, 7, 6, 5, 4, 3, 2, 1],
  }>>['state']['stack'], [1], Test.Pass>(),
  // out of bounds read
  check<Interpret<[9, READ], DefaultWithOverwrite<{
    debug: true,
    heap: [9, 8, 7, 6, 5, 4, 3, 2, 1],
  }>>['state']['stack'], [never], Test.Pass>(),

  // COMBINATIONS OF (NON-BRANCHING) INSTRUCTIONS
  check<Interpret<[10, 1, SUB, 5, ADD, DUP, PRINT, 2, ADD, PRINT]>['state']['output'], "1416", Test.Pass>(),

  // IF (EXECUTE)
  check<Interpret<[1, IF_START, 1000, PRINT, IF_END, 2, PRINT], DefaultInterpreterState>['state']['output'], "10002", Test.Pass>(),

  // IF (SKIP)
  check<Interpret<[0, IF_START, 1000, PRINT, IF_END, 2, PRINT], DefaultInterpreterState>['state']['output'], "2", Test.Pass>(),

  // IF (NESTED)
  check<Interpret<[1, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>['state']['output'], "100010012", Test.Pass>(),
  check<Interpret<[1, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>['state']['output'], "10002", Test.Pass>(),
  check<Interpret<[0, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>['state']['output'], "2", Test.Pass>(),
  check<Interpret<[0, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>['state']['output'], "2", Test.Pass>(),

  // WHILE LOOP (ONCE)
  check<Interpret<[1, WHILE_START, 1, PRINT, 0, WHILE_END]>['state']['output'], "1", Test.Pass>(),

  // IF IN WHILE LOOP
  check<Interpret<[1, WHILE_START, 1, IF_START, 1, PRINT, 0, IF_END, WHILE_END]>['state']['output'], "1", Test.Pass>(),

  // NESTED IFS IN WHILE LOOP
  check<Interpret<[1, WHILE_START, 1, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT, 0, WHILE_END]>['state']['output'], "100010012", Test.Pass>(),
  check<Interpret<[1, WHILE_START, 1, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT, 0, WHILE_END]>['state']['output'], "10002", Test.Pass>(),
  check<Interpret<[1, WHILE_START, 0, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT, 0, WHILE_END]>['state']['output'], "2", Test.Pass>(),
  check<Interpret<[1, WHILE_START, 0, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT, 0, WHILE_END]>['state']['output'], "2", Test.Pass>(),

  // INFINITE WHILE LOOP (INTERNAL MAX CALLS REACHED)
  check<Interpret<[1, WHILE_START, 1, PRINT, 1, WHILE_END]>['state']['output'], "1111111111111111", Test.Pass>(),

  // 7 WHILE LOOPS (total allowed before max call stack reached)
  check<Interpret<[
    // write 5 into linear memory at index 0
    7,
    0,
    WRITE,

    // start while loop
    1,
    WHILE_START,
    
    // print value at memory index
    0,
    READ,
    // duplicate the value the new value, so that it's on the top of the
    // stack for when we decrement it in a second
    DUP,
    PRINT,

    // subtract 1 from the value at memory index 0
    1,
    SUB,
    // duplicate the new value, so that it's on the top of the
    // stack for the next iteration of the while loop
    DUP,
    // write the new value into linear memory
    0,
    WRITE,

    WHILE_END
  ], DefaultInterpreterState>['state']['output'], "7654321", Test.Pass>(),
]);
