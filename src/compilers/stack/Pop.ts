import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/** Removes the last element from the stack */
export type Pop<Tuple extends T[], T = any> = Tuple extends [...infer Rest, infer _Last]
  ? Rest
  : [];

checks([
  // should return the last element from a tuple
  check<Pop<[number, string, boolean]>, [number, string], Test.Pass>(),
  check<Pop<[0, 1, 2]>, [0, 1], Test.Pass>(),
  check<Pop<[""]>, [], Test.Pass>(),

  check<Pop<[number, string, boolean], any>, [number, string], Test.Pass>(),
  check<Pop<[0, 1, 2], number>, [0, 1], Test.Pass>(),
  check<Pop<[""], string>, [], Test.Pass>(),

  // should return itself when given an empty tuple
  check<Pop<[]>, [], Test.Pass>(),
]);
