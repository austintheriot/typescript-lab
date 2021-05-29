import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/**
 * Returns true if Type1 is a union that includes Type2.
 * If Type1 is ONLY Type2 (no union), returns false.
 */
export type IsUnionWith<Type1 extends unknown, Type2 extends unknown> = Exclude<Type1, Type2> extends never ? false : true;

checks([
  // should return true for union types
  check<IsUnionWith<string | boolean, string>, true, Test.Pass>(),
  check<IsUnionWith<string | number, string>, true, Test.Pass>(),
  check<IsUnionWith<string | number | boolean | (() => string), string>, true, Test.Pass>(),
  check<IsUnionWith<string | boolean, boolean>, true, Test.Pass>(),
  check<IsUnionWith<boolean | number | 1 | '', boolean>, true, Test.Pass>(),
  check<IsUnionWith<'example' | number | 1 | 'guess', 'example'>, true, Test.Pass>(),
  
  // should return false for unitary types
  check<IsUnionWith<string, string>, false, Test.Pass>(),
  check<IsUnionWith<boolean, boolean>, false, Test.Pass>(),
  check<IsUnionWith<1, 1>, false, Test.Pass>(),
  check<IsUnionWith<'example', 'example'>, false, Test.Pass>(),
  check<IsUnionWith<null, null>, false, Test.Pass>(),
]);