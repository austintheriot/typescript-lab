import { Test } from "ts-toolbelt";

const { checks, check } = Test;

/**
 * Removes the last element from a tuple.
 */
export type PopTuple<Tuple> = Tuple extends []
  ? []
  : Tuple extends [...infer Rest, unknown]
  ? Rest
  : never;

checks([
  // should remove the last element from a tuple
  check<PopTuple<[number, string, boolean]>, [number, string], Test.Pass>(),
  check<PopTuple<[0, 1, 2]>, [0, 1], Test.Pass>(),
  check<PopTuple<[""]>, [], Test.Pass>(),

  // should return itself when given an empty tuple
  check<PopTuple<[]>, [], Test.Pass>(),
]);
