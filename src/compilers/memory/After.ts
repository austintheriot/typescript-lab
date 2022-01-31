import { Test } from 'ts-toolbelt';
import { Before } from './Before';
import { GreaterThanOrEqualTo } from '../math/GreaterThanOrEqualTo';
const { checks, check } = Test;

export type After<Memory extends unknown[], Index> =
  GreaterThanOrEqualTo<Index, Memory['length']> extends true
  ? []
  : Memory extends [...Before<Memory, Index>, infer _Value, ...infer Rest]
  ? Rest
  : never;

checks([
  check<After<[0, 1, 2, 3, 4, 5], 0>, [1, 2, 3, 4, 5], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 1>, [2, 3, 4, 5], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 2>, [3, 4, 5], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 3>, [4, 5], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 4>, [5], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 5>, [], Test.Pass>(),

  // index too high: just return empty array
  check<After<[0, 1, 2, 3, 4, 5], 6>, [], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 7>, [], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 8>, [], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 8>, [], Test.Pass>(),
  check<After<[0, 1, 2, 3, 4, 5], 10>, [], Test.Pass>(),
]);
