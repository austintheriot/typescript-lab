
import { Test } from 'ts-toolbelt';
import { DefaultInterpreterState, Interpret } from './Interpret';
import { ADD, DROP, DUP, IF_END, IF_START, PRINT, SUB, WHILE_END, WHILE_START } from './Tokens';
const { checks, check } = Test;

type DefaultWithDebug = Omit<DefaultInterpreterState, 'debug'> & { debug: true };

checks([
  // PRINT
  check<Interpret<[1, PRINT]>, "1", Test.Pass>(),
  check<Interpret<[1, PRINT, 2, PRINT]>, "12", Test.Pass>(),

  // ADD
  check<Interpret<[1, 2, ADD, PRINT]>, "3", Test.Pass>(),
  check<Interpret<[1, 2, ADD, 5, ADD, PRINT]>, "8", Test.Pass>(),
  check<Interpret<[400, 100, ADD, 5, ADD, PRINT]>, "505", Test.Pass>(),

  // SUB
  check<Interpret<[3, 2, SUB, PRINT]>, "1", Test.Pass>(),
  check<Interpret<[10, 1, SUB, 5, SUB, PRINT]>, "4", Test.Pass>(),
  check<Interpret<[400, 200, SUB, 5, SUB, PRINT]>, "195", Test.Pass>(),

  // DROP
  check<Interpret<[1, 2, DROP], DefaultWithDebug>['state']['stack'], [1], Test.Pass>(),

  // DUP
  check<Interpret<[1, 2, DUP], DefaultWithDebug>['state']['stack'], [1, 2, 2], Test.Pass>(),


  // COMBINATIONS OF (NON-BRANCHING) INSTRUCTIONS
  check<Interpret<[10, 1, SUB, 5, ADD, DUP, PRINT, 2, ADD, PRINT]>, "1416", Test.Pass>(),

  // IF (EXECUTE)
  check<Interpret<[1, IF_START, 1000, PRINT, IF_END, 2, PRINT], DefaultWithDebug>['state']['output'], "10002", Test.Pass>(),

  // IF (SKIP)
  check<Interpret<[0, IF_START, 1000, PRINT, IF_END, 2, PRINT], DefaultWithDebug>['state']['output'], "2", Test.Pass>(),

  // IF (NESTED)
  check<Interpret<[1, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>, "100010012", Test.Pass>(),
  check<Interpret<[1, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>, "10002", Test.Pass>(),
  check<Interpret<[0, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>, "2", Test.Pass>(),
  check<Interpret<[0, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT]>, "2", Test.Pass>(),

  // WHILE LOOP (ONCE)
  check<Interpret<[1, WHILE_START, 1, PRINT, 0, WHILE_END]>, "1", Test.Pass>(),

  // IF IN WHILE LOOP
  check<Interpret<[1, WHILE_START, 1, IF_START, 1, PRINT, 0, IF_END, WHILE_END]>, "1", Test.Pass>(),

  // NESTED IFS IN WHILE LOOP
  check<Interpret<[1, WHILE_START, 1, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT, 0, WHILE_END]>, "100010012", Test.Pass>(),
  check<Interpret<[1, WHILE_START, 1, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT, 0, WHILE_END]>, "10002", Test.Pass>(),
  check<Interpret<[1, WHILE_START, 0, IF_START, 1000, PRINT, 0, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT, 0, WHILE_END]>, "2", Test.Pass>(),
  check<Interpret<[1, WHILE_START, 0, IF_START, 1000, PRINT, 1, IF_START, 1001, PRINT, IF_END, IF_END, 2, PRINT, 0, WHILE_END]>, "2", Test.Pass>(),

  // INFINITE WHILE LOOP (INTERNAL MAX CALLS REACHED)
  check<Interpret<[1, WHILE_START, 1, PRINT, 1, WHILE_END]>['state']['output'], "1111111111111111", Test.Pass>(),
]);
