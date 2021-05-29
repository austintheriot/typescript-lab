import { Test } from "ts-toolbelt";
import { SubtractOneFromPositive } from "./SubtractOneFromPositive";

const { checks, check } = Test;

/**
 * Removes the last element from a tuple.
 */
export type PopTuple<
  Tuple extends unknown[],
  _TupleStorage extends unknown[] = []
  > =
  Tuple['length'] extends 0
  ? Tuple
  : (_TupleStorage["length"] extends SubtractOneFromPositive<Tuple["length"]>
  ? _TupleStorage
  : PopTuple<Tuple, [..._TupleStorage, Tuple[_TupleStorage["length"]]]>);

checks([
  // should remove the last element from a tuple
  check<PopTuple<[number, string, boolean]>, [number, string], Test.Pass>(),
  check<PopTuple<[0, 1, 2]>, [0, 1], Test.Pass>(),
  check<PopTuple<[""]>, [], Test.Pass>(),

  // should return itself when given an empty tuple
  check<PopTuple<[]>, [], Test.Pass>(),
]);
