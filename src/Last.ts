import { Test } from "ts-toolbelt";
import { LastCharacter } from "./LastCharacter";
import { LastElement } from "./LastElement";
const { checks, check } = Test;

/**
 * Returns the last element/character from a tuple/string.
 */
export type Last<T extends unknown> = T extends string
  ? LastCharacter<T>
  : T extends unknown[]
  ? LastElement<T>
  : never;

checks([
  // if template literal, should return the last character
  check<Last<"a">, "a", Test.Pass>(),
  check<Last<"ab">, "b", Test.Pass>(),
  check<Last<"abc">, "c", Test.Pass>(),
  check<Last<"Hello world!">, "!", Test.Pass>(),

  // should return itself when given an empty string
  check<Last<"">, "", Test.Pass>(),

  // should reject plain string type
  check<Last<string>, never, Test.Pass>(),

  // if tuple, should return the last element from a tuple
  check<Last<[number, string, boolean]>, boolean, Test.Pass>(),
  check<Last<[0, 1, 2]>, 2, Test.Pass>(),
  check<Last<[""]>, "", Test.Pass>(),

  // should return itself when given an empty tuple
  check<Last<[]>, [], Test.Pass>(),
]);
