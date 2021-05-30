import { Test } from "ts-toolbelt";
import { Split } from "ts-toolbelt/out/String/_api";
import { IsTemplateLiteral } from "./IsTemplateLiteral";
const { checks, check } = Test;

/**
 * Returns the length of a string.
 */
export type LengthOfString<S extends string> = IsTemplateLiteral<S> extends true ? Split<S>['length'] : never;

checks([
  // should return the last character from a template literal
  check<LengthOfString<'a'>, 1, Test.Pass>(),
  check<LengthOfString<'ab'>, 2, Test.Pass>(),
  check<LengthOfString<'abc'>, 3, Test.Pass>(),
  check<LengthOfString<'O brave new world!'>, 18, Test.Pass>(),

  // should return itself when given an empty string
  check<LengthOfString<''>, 0, Test.Pass>(),
]);