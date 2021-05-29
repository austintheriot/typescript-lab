import { Test } from "ts-toolbelt";
const { checks, check } = Test;

export type IsTemplateLiteral<S extends unknown> = S extends string
  ? (
      Exclude<S, string> extends false
        ? S extends `${infer Prefix}${S}`
          ? Prefix
          : false
        : never
    ) extends string
    ? true
    : false
  : false;

checks([
  // should return true for template literals
  check<IsTemplateLiteral<"">, true, Test.Pass>(),
  check<IsTemplateLiteral<"hello world">, true, Test.Pass>(),

  // should return false for plain string type
  check<IsTemplateLiteral<string>, false, Test.Pass>(),

  // should return false for bogus input
  check<IsTemplateLiteral<"example" | string>, false, Test.Pass>(),
  check<IsTemplateLiteral<string | boolean>, false, Test.Pass>(),
  check<IsTemplateLiteral<string[]>, false, Test.Pass>(),
  check<IsTemplateLiteral<Record<string, 'hello'>>, false, Test.Pass>(),
]);