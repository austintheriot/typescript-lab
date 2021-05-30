import { Test } from "ts-toolbelt";
import { Split } from "ts-toolbelt/out/String/_api";
import { IsPlainString } from "./IsPlainString";
import { IsTemplateLiteral } from "./IsTemplateLiteral";
import { IsUnionWith } from "./IsUnionWith";
import { ShiftTuple } from "./ShiftTuple";
import { Join } from "./Join";

const { checks, check } = Test;

/**
 * Removes the last element from a string.
 */
export type ShiftString<S extends unknown> = IsUnionWith<S, string> extends true
  ? never
  : IsPlainString<S> extends true
  ? never
  : S extends string
  ? IsTemplateLiteral<S> extends true
    ? Join<ShiftTuple<Split<S>>>
    : never
  : never;

checks([
  // should pop the last element off of a string
  check<ShiftString<"Hello world!">, "ello world!", Test.Pass>(),
  check<ShiftString<"example">, "xample", Test.Pass>(),
  check<ShiftString<"abc">, "bc", Test.Pass>(),
  check<ShiftString<"">, "", Test.Pass>(),
  
  // should return never for bogus inputs
  check<ShiftString<"a" | boolean>, never, Test.Pass>(),
  check<ShiftString<string>, never, Test.Pass>(),
  check<ShiftString<number>, never, Test.Pass>(),
  check<ShiftString<[]>, never, Test.Pass>(),

  // should remove the first element from a tuple
  check<ShiftTuple<[number, string, boolean]>, [string, boolean], Test.Pass>(),
  check<ShiftTuple<[0, 1, 2]>, [1, 2], Test.Pass>(),
  check<ShiftTuple<[""]>, [], Test.Pass>(),

  // empty tuple should return itself
  check<ShiftTuple<[]>, [], Test.Pass>(),
]);
