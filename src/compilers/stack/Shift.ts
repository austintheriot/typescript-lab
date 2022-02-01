import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/** Returns the last element from the stack */
export type Shift<Tuple extends T[], T = any> = Tuple extends [infer _Head, ...infer Rest]
  ? Rest
  : never;

checks([
  // should return the last element from a tuple
  check<Shift<[number, string, boolean]>, [string, boolean], Test.Pass>(),
  check<Shift<[0, 1, 2]>, [1, 2], Test.Pass>(),
  check<Shift<[""]>, [], Test.Pass>(),

  // should work when specifying the type
  check<Shift<[number, string, boolean], any>, [string, boolean], Test.Pass>(),
  check<Shift<[0, 1, 2], number>, [1, 2], Test.Pass>(),
  check<Shift<[""], string>, [], Test.Pass>(),

  check<Shift<[]>, never, Test.Pass>(),
]);
