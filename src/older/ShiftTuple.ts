import { Test } from "ts-toolbelt";

const { checks, check } = Test;

/**
 * Removes the first element from a tuple.
 */
export type ShiftTuple<
  Tuple extends unknown
> = Tuple extends []
  ? []
  : Tuple extends [unknown, ...infer Rest]
  ? Rest
  : never;

checks([
  // should remove the first element from a tuple
  check<ShiftTuple<[number, string, boolean]>, [string, boolean], Test.Pass>(),
  check<ShiftTuple<[0, 1, 2]>, [1, 2], Test.Pass>(),
  check<ShiftTuple<[""]>, [], Test.Pass>(),

  // empty tuple should return itself
  check<ShiftTuple<[]>, [], Test.Pass>(),
]);
