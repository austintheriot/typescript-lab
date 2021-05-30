import { Test } from "ts-toolbelt";
import { IsTemplateLiteral } from "./IsTemplateLiteral";
const { checks, check } = Test;
import { LengthOfString } from "./LengthOfString";

/**
 * Returns the last character from a string.
 */
export type LastCharacter<S extends string> = IsTemplateLiteral<S> extends true
  ? LengthOfString<S> extends 0 | 1
    ? S
    : S extends `${string}${infer Rest}`
    ? LastCharacter<Rest>
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
]);
