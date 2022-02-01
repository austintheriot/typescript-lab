import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/** Removes the last element from the stack */
export type Push<Tuple extends unknown[], Element> = [...Tuple, Element];

checks([
  // should return the last element from a tuple
  check<Push<[number, string, boolean], 1>, [number, string, boolean, 1], Test.Pass>(),
  check<Push<[0, 1, 2], undefined>, [0, 1, 2, undefined], Test.Pass>(),
  check<Push<[""], "">, ["", ""], Test.Pass>(),
  check<Push<[], null>, [null], Test.Pass>(),
  check<Push<[], []>, [[]], Test.Pass>(),
]);
