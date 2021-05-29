import { Test } from "ts-toolbelt";

const { checks, check } = Test;

/**
 * Removes the first element from a tuple.
 */
export type ShiftTuple<
  Tuple extends unknown[], // any tuple
  _TupleStorage extends unknown[] = [], // constructs new tuple
  _IndexStorage extends number[] = [0]
> = Tuple["length"] extends 0 // begins at 1
  ? Tuple
  : _IndexStorage["length"] extends Tuple["length"]
  ? _TupleStorage
  : ShiftTuple<
      Tuple, // keep original tuple
      [..._TupleStorage, Tuple[_IndexStorage["length"]]], // build new tuple from 1
      [..._IndexStorage, 0] // increase length by 1
    >;

checks([
  // should remove the first element from a tuple
  check<
    ShiftTuple<[number, string, boolean]>,
    [string, boolean],
    Test.Pass
  >(),
  check<ShiftTuple<[0, 1, 2]>, [1, 2], Test.Pass>(),
  check<ShiftTuple<[""]>, [], Test.Pass>(),

  // empty tuple should return itself
  check<ShiftTuple<[]>, [], Test.Pass>(),
]);
