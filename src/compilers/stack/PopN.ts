import { Test } from "ts-toolbelt";
import { Dec } from "../math/Dec";
import { Pop } from "./Pop";
const { checks, check } = Test;

/** Removes the last N element from the stack */
export type PopN<Tuple extends T[], N extends number = 0, T = any> =
  N extends 0
  ? Tuple
  : Tuple['length'] extends 0
  ? Tuple
  : PopN<Pop<Tuple, T>, Dec<N>, T>;

checks([
  // should return the last element from a tuple
  check<PopN<[number, string, boolean], 1>, [number, string], Test.Pass>(),
  check<PopN<[0, 1, 2], 2>, [0], Test.Pass>(),
  check<PopN<["hello", 0, null, undefined], 3>, ["hello"], Test.Pass>(),

  check<PopN<[number, string, boolean], 1, any>, [number, string], Test.Pass>(),
  check<PopN<[0, 1, 2], 2, number>, [0], Test.Pass>(),
  check<PopN<["hello", 0, null, undefined], 3, any>, ["hello"], Test.Pass>(),

  // should return itself when given an empty tuple
  check<PopN<[], 10>, [], Test.Pass>(),
]);
