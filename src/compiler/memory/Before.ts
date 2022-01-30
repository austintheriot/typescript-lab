import { Test } from 'ts-toolbelt';
import { GreaterThan } from '../math/GreaterThan';
const { checks, check } = Test;

export type Before<Memory extends unknown[], Index, Storage extends unknown[] = []> =
  // if index is out of bounds, return up to the length of the array
  GreaterThan<Index, Memory['length']> extends true
  ? Before<Memory, Memory['length'], Storage>
  : Storage['length'] extends Index
  ? Storage
  : Before<Memory, Index, [...Storage, Memory[Storage['length']]]>
 
checks([
  check<Before<[0, 1, 2, 3, 4, 5], 0>, [], Test.Pass>(),
  check<Before<[0, 1, 2, 3, 4, 5], 1>, [0], Test.Pass>(),
  check<Before<[0, 1, 2, 3, 4, 5], 2>, [0, 1], Test.Pass>(),
  check<Before<[0, 1, 2, 3, 4, 5], 3>, [0, 1, 2], Test.Pass>(),
  check<Before<[0, 1, 2, 3, 4, 5], 4>, [0, 1, 2, 3], Test.Pass>(),
  check<Before<[0, 1, 2, 3, 4, 5], 5>, [0, 1, 2, 3, 4], Test.Pass>(),
  check<Before<[0, 1, 2, 3, 4, 5], 6>, [0, 1, 2, 3, 4, 5], Test.Pass>(),

  // index too high: just return the full array
  check<Before<[0, 1, 2, 3, 4, 5], 7>, [0, 1, 2, 3, 4, 5], Test.Pass>(),
]);
