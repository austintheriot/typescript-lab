import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/**
 * Returns the last element from a tuple.
 */
export type LastElement<Tuple extends unknown> = Tuple extends unknown[]
  ? Tuple extends []
    ? []
    // eslint-disable-next-line no-unused-vars 
    : Tuple extends [...infer Rest, infer Tail]
    ? Tail
    : never
  : never;

checks([
  // should return the last element from a tuple
  check<LastElement<[number, string, boolean]>, boolean, Test.Pass>(),
  check<LastElement<[0, 1, 2]>, 2, Test.Pass>(),
  check<LastElement<[""]>, '', Test.Pass>(),

  // should return itself when given an empty tuple
  check<LastElement<[]>, [], Test.Pass>(),
]);
