import { Test } from "ts-toolbelt";
import { Split } from "ts-toolbelt/out/String/_api";
import { IsPlainString } from "./IsPlainString";
import { IsTemplateLiteral } from "./IsTemplateLiteral";
import { IsUnionWith } from "./IsUnionWith";
import { PopTuple } from "./PopTuple";
import { Join } from "./Join";

const { checks, check } = Test;

/**
 * Removes the last element from a string.
 */
export type PopString<S extends unknown> = IsUnionWith<S, string> extends true
  ? never
  : S extends ""
  ? ""
  : IsPlainString<S> extends true
  ? never
  : S extends string
  ? IsTemplateLiteral<S> extends true
    ? Join<PopTuple<Split<S>>>
    : never
  : never;


checks([
  // should pop the last element off of a string
  check<PopString<"Hello world!">, "Hello world", Test.Pass>(),
  check<PopString<"example">, "exampl", Test.Pass>(),
  check<PopString<"abc">, "ab", Test.Pass>(),
  check<PopString<"">, "", Test.Pass>(),

  // should return never for bogus inputs
  check<PopString<"a" | boolean>, never, Test.Pass>(),
  check<PopString<string>, never, Test.Pass>(),
  check<PopString<number>, never, Test.Pass>(),
  check<PopString<[]>, never, Test.Pass>(),
]);
