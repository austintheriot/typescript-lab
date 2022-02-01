import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/** Returns the last element from the stack */
export type First<Tuple extends T[], T = any> = Tuple extends [infer Head, ...infer _Rest]
  ? Head
  : never;

checks([
  // should return the last element from a tuple
  check<First<[number, string, boolean]>, number, Test.Pass>(),
  check<First<[0, 1, 2]>, 0, Test.Pass>(),
  check<First<[""]>, "", Test.Pass>(),

  // should work when specifying the type
  check<First<[number, string, boolean], any>, number, Test.Pass>(),
  check<First<[0, 1, 2], number>, 0, Test.Pass>(),
  check<First<[""], string>, '', Test.Pass>(),

  check<First<[]>, never, Test.Pass>(),
]);
