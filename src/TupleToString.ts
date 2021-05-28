import { Test } from "ts-toolbelt";
import { Shift } from "./Shift";

const { checks, check } = Test;

/**
 * Converts a tuple of strings into a single string.
 */
export type TupleToString<
  Tuple extends string[],
  _StorageString extends string = ""
> = Tuple extends string[]
  ? Tuple["length"] extends 0
    ? _StorageString
    : TupleToString<Shift<Tuple>, `${_StorageString}${Tuple[0]}`>
  : never;

checks([
  // should concatenate a tuple of strings into a single string
  check<TupleToString<["hello ", "world"]>, "hello world", Test.Pass>(),
  check<TupleToString<[]>, "", Test.Pass>(),
]);
