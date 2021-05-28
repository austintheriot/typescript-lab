import { Test } from "ts-toolbelt";
const { checks, check } = Test;

export type IsTemplateLiteral<S extends unknown> = S extends string
  ? (S extends `${infer Prefix}${S}` ? Prefix : false) extends string
    ? true
    : false
  : false;

checks([
  check<IsTemplateLiteral<"">, true, Test.Pass>(),
  check<IsTemplateLiteral<"hello world">, true, Test.Pass>(),

  check<IsTemplateLiteral<string>, false, Test.Pass>(),
  check<IsTemplateLiteral<"example" | string>, false, Test.Pass>(),
]);

export type IsPlainString<S extends unknown> = S extends string
  ? (S extends `${infer Prefix}${S}` ? Prefix : false) extends string
    ? false
    : true
  : false;

checks([
  check<IsPlainString<"">, false, Test.Pass>(),
  check<IsPlainString<"hello world">, false, Test.Pass>(),

  check<IsPlainString<string>, true, Test.Pass>(),
  check<IsPlainString<"example" | string>, true, Test.Pass>(),
]);
