import { Test } from "ts-toolbelt";
import { IsUnionWith } from "./IsUnionWith";
const { checks, check } = Test;

export type IsPlainString<S extends unknown> = IsUnionWith<
  S,
  string
> extends true
  ? false
  : S extends string
  ? (S extends `${infer Prefix}${S}` ? Prefix : false) extends string
    ? false
    : true
  : false;

checks([
  // returns true for plain string
  check<IsPlainString<string>, true, Test.Pass>(),
  check<IsPlainString<'example' | string>, true, Test.Pass>(),

  // returns false for template literals
  check<IsPlainString<"">, false, Test.Pass>(),
  check<IsPlainString<"hello world">, false, Test.Pass>(),

  // returns false for unions
  check<IsPlainString<"example" | boolean>, false, Test.Pass>(),
  check<IsPlainString<"example" | 1 | false>, false, Test.Pass>(),
]);
