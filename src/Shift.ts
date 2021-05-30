import { Test } from "ts-toolbelt";
import { ShiftString } from "./ShiftString";
import { ShiftTuple } from "./ShiftTuple";
const { checks, check } = Test;

/**
 * Removes the first element/character from a tuple or string.
 */
export type Shift<T extends unknown> = T extends string
  ? ShiftString<T>
  : T extends [] | unknown[]
  ? ShiftTuple<T>
  : never;

checks([
  // if string, should remove the first element from a string
  check<Shift<"Hello world!">, "ello world!", Test.Pass>(),
  check<Shift<"example">, "xample", Test.Pass>(),
  check<Shift<"abc">, "bc", Test.Pass>(),
  check<Shift<"">, "", Test.Pass>(),

  // if tuple, should remove the first element from a tuple
  check<Shift<[number, string, boolean]>, [string, boolean], Test.Pass>(),
  check<Shift<[0, 1, 2]>, [1, 2], Test.Pass>(),
  check<Shift<[""]>, [], Test.Pass>(),
  
  // empty tuple should return itself
  check<Shift<[]>, [], Test.Pass>(),

  // should return never for bogus inputs
  check<Shift<string>, never, Test.Pass>(),
  check<Shift<number>, never, Test.Pass>(),
]);
