import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/** Returns the last element from the stack */
export type Last<Tuple extends T[], T = any> = Tuple extends [...infer _Rest, infer Tail]
  ? Tail
  : never;

checks([
  // should return the last element from a tuple
  check<Last<[number, string, boolean]>, boolean, Test.Pass>(),
  check<Last<[0, 1, 2]>, 2, Test.Pass>(),
  check<Last<[""]>, '', Test.Pass>(),

  // should work when specifying the type
  check<Last<[number, string, boolean], any>, boolean, Test.Pass>(),
  check<Last<[0, 1, 2], number>, 2, Test.Pass>(),
  check<Last<[""], string>, '', Test.Pass>(),

  check<Last<[]>, never, Test.Pass>(),
]);
