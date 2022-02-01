import { Test } from "ts-toolbelt";
import { Dec } from "../math/Dec";
import { Pop } from "./Pop";
const { checks, check } = Test;

/** Removes the last NToRemove element from the stack and pushed on ElementsToAdd */
export type Replace<Tuple extends unknown[], NToRemove extends number, ElementsToAdd extends unknown[]> =
  NToRemove extends 0
  ? [...Tuple, ...ElementsToAdd]
  : Tuple['length'] extends 0
  ? [...Tuple, ...ElementsToAdd]
  : Replace<Pop<Tuple>, Dec<NToRemove>, ElementsToAdd>;

checks([
  // should return the last element from a tuple
  check<Replace<[number, string, boolean], 1, [null]>, [number, string, null], Test.Pass>(),
  check<Replace<[0, 1, 2], 2, [undefined]>, [0, undefined], Test.Pass>(),
  check<Replace<["hello", 0, null, undefined], 3, []>, ["hello"], Test.Pass>(),

  // should return itself when given an empty tuple
  check<Replace<[], 10, []>, [], Test.Pass>(),
]);
