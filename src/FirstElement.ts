import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/**
 * Returns the first element from a tuple.
 */
export type FirstElement<Tuple extends unknown> = Tuple extends unknown[]
  ? Tuple extends []
    ? []
    : Tuple extends [infer Head, ...unknown[]]
    ? Head
    : never
  : never;

checks([
  // should return the first element from a tuple
  check<FirstElement<[number, string, boolean]>, number, Test.Pass>(),
  check<FirstElement<[0, 1, 2]>, 0, Test.Pass>(),
  check<FirstElement<[""]>, '', Test.Pass>(),

  // should return itself when given an empty tuple
  check<FirstElement<[]>, [], Test.Pass>(),
]);
