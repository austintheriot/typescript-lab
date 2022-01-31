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
  check<Pop<"Hello world!...">, "Hello world!..", Test.Pass>(),
  check<Pop<"Hello world!">, "Hello world", Test.Pass>(),
  check<Pop<"example">, "exampl", Test.Pass>(),
  check<Pop<"abc">, "ab", Test.Pass>(),

  // should return itself when given an empty string
  check<Pop<"">, "", Test.Pass>(),

  // if tuple, should remove the last element from a tuple
  check<Pop<[number, string, boolean]>, [number, string], Test.Pass>(),
  check<Pop<[0, 1, 2]>, [0, 1], Test.Pass>(),
  check<Pop<[""]>, [], Test.Pass>(),

  // should return itself when given an empty tuple
  check<Pop<[]>, [], Test.Pass>(),

  // should return never for bogus inputs
  check<Pop<string>, never, Test.Pass>(),
  check<Pop<number>, never, Test.Pass>(),
]);
