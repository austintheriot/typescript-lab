import { Test } from "ts-toolbelt";
import { IsTemplateLiteral } from "./IsTemplateLiteral";
const { checks, check } = Test;

/**
 * Returns the last character from a string.
 */
export type LastCharacter<S extends unknown> = IsTemplateLiteral<S> extends true
  ? (S extends `${string}${infer Last}` ? Last : S) extends ""
    ? S
    : S extends `${string}${infer Last}`
    ? LastCharacter<Last>
    : S
  : never;

checks([
  // should return the last character from a template literal
  check<LastCharacter<"a">, "a", Test.Pass>(),
  check<LastCharacter<"ab">, "b", Test.Pass>(),
  check<LastCharacter<"abc">, "c", Test.Pass>(),
  check<LastCharacter<"Hello world!">, "!", Test.Pass>(),

  // should return itself when given an empty string
  check<LastCharacter<"">, "", Test.Pass>(),

  // should reject plain string type
  check<LastCharacter<string>, never, Test.Pass>(),

  // should reject bogus input
  check<LastCharacter<boolean>, never, Test.Pass>(),
  check<LastCharacter<true>, never, Test.Pass>(),
  check<LastCharacter<1>, never, Test.Pass>(),
  check<LastCharacter<['hello']>, never, Test.Pass>(),
  check<LastCharacter<boolean | 'hello'>, never, Test.Pass>(),
]);
