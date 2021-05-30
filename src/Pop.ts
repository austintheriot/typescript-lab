import { Test } from "ts-toolbelt";
import { PopString } from "./PopString";
import { PopTuple } from "./PopTuple";
const { checks, check } = Test;

/**
 * Removes the last element/character from a tuple or string.
 */
export type Pop<T extends unknown> = T extends string
  ? PopString<T>
  : T extends unknown[]
  ? PopTuple<T>
  : never;

checks([
  // if string, should should pop the last element off of a string
  check<PopString<"Hello world!...">, "Hello world!..", Test.Pass>(),
  check<PopString<"Hello world!">, "Hello world", Test.Pass>(),
  check<PopString<"example">, "exampl", Test.Pass>(),
  check<PopString<"abc">, "ab", Test.Pass>(),

  // should return itself when given an empty string
  check<PopString<"">, "", Test.Pass>(),

  // if tuple, should remove the last element from a tuple
  check<PopTuple<[number, string, boolean]>, [number, string], Test.Pass>(),
  check<PopTuple<[0, 1, 2]>, [0, 1], Test.Pass>(),
  check<PopTuple<[""]>, [], Test.Pass>(),

  // should return itself when given an empty tuple
  check<PopTuple<[]>, [], Test.Pass>(),

  // should return never for bogus inputs
  check<PopString<"a" | boolean>, never, Test.Pass>(),
  check<PopString<string>, never, Test.Pass>(),
  check<PopString<number>, never, Test.Pass>(),
  check<PopString<[]>, never, Test.Pass>(),
]);
