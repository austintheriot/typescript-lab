import { Test } from "ts-toolbelt";
import { SubtractOne } from "./SubtractOne";

const { checks, check } = Test;

/**
 * Removes the last element from a tuple.
 */
export type Pop<
  Tuple extends unknown[],
  _TupleStorage extends unknown[] = [],
  > = _TupleStorage['length'] extends SubtractOne<Tuple['length']>
  ? _TupleStorage : Pop<Tuple, [..._TupleStorage, Tuple[_TupleStorage['length']]]>

checks([
  // should remove the last element from a tuple
  check<
    Pop<[number, string, boolean]>,
    [number, string],
    Test.Pass
  >(),
  check<Pop<[0, 1, 2]>, [0, 1], Test.Pass>(),
  check<Pop<[""]>, [], Test.Pass>(),

  // should return itself when given an empty tuple
  check<Pop<[]>, [], Test.Pass>(),
]);
