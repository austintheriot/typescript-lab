import { Test } from "ts-toolbelt";
import { ShiftTuple } from "./ShiftTuple";

const { checks, check } = Test;

/**
 * Converts a tuple of strings into a single string.
 * 
 * @example
 * ['a', 'b', 'c'] --> 'abc'
 */
export type Join<
  Tuple extends string[],
  _StorageString extends string = ""
> = Tuple extends string[]
  ? Tuple["length"] extends 0
    ? _StorageString
    : Join<ShiftTuple<Tuple>, `${_StorageString}${Tuple[0]}`>
  : never;

checks([
  // should concatenate a tuple of strings into a single string
  check<Join<["hello ", "world"]>, "hello world", Test.Pass>(),
  check<Join<[]>, "", Test.Pass>(),
]);
