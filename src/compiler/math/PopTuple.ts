import { Test } from "ts-toolbelt";
import { ToNumericTuple } from "./ToNumericTuple";

const { checks, check } = Test;

/**
 * Removes the last element from a tuple.
 */
export type PopTuple<Tuple extends number[]> = ToNumericTuple<Tuple extends []
? []
: Tuple extends [...infer Rest, infer _Tail]
? Rest
: never>;

checks([
  // should remove the last element from a tuple
  check<PopTuple<[number, number, number]>, [number, number], Test.Pass>(),
  check<PopTuple<[0, 1, 2]>, [0, 1], Test.Pass>(),
  check<PopTuple<[1]>, [], Test.Pass>(),

  // should return itself when given an empty tuple
  check<PopTuple<[]>, [], Test.Pass>(),
]);
