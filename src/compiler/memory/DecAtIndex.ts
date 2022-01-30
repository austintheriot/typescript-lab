import { Test } from 'ts-toolbelt';
const { checks, check } = Test;
import { Write } from './Write';
import { GreaterThanOrEqualTo } from '../math/GreaterThanOrEqualTo';
import { Dec } from '../math/Dec';

export type DecAtIndex<Memory, Index> =
  Memory extends number[] ? (
    Index extends number ?
    (
      GreaterThanOrEqualTo<Index, Memory['length']> extends true
      ? Memory
      : Write<Memory, Index, Dec<Memory[Index]>>
    ) : never
  ) : never;

checks([
  // should work with 1
  check<DecAtIndex<[1, 1, 1, 1, 1], 0>, [0, 1, 1, 1, 1], Test.Pass>(),
  check<DecAtIndex<[1, 1, 1, 1, 1], 1>, [1, 0, 1, 1, 1], Test.Pass>(),
  check<DecAtIndex<[1, 1, 1, 1, 1], 2>, [1, 1, 0, 1, 1], Test.Pass>(),
  check<DecAtIndex<[1, 1, 1, 1, 1], 3>, [1, 1, 1, 0, 1], Test.Pass>(),
  check<DecAtIndex<[1, 1, 1, 1, 1], 4>, [1, 1, 1, 1, 0], Test.Pass>(),

  // should work with other numbers
  check<DecAtIndex<[10, 0, 0, 0, 0], 0>, [9, 0, 0, 0, 0], Test.Pass>(),
  check<DecAtIndex<[0, 15, 0, 0, 0], 1>, [0, 14, 0, 0, 0], Test.Pass>(),
  check<DecAtIndex<[0, 0, 31, 0, 0], 2>, [0, 0, 30, 0, 0], Test.Pass>(),
  check<DecAtIndex<[0, 0, 0, 11, 0], 3>, [0, 0, 0, 10, 0], Test.Pass>(),

  // out of range: nop
  check<DecAtIndex<[0, 0, 0, 0, 0], 5>, [0, 0, 0, 0, 0], Test.Pass>(),
]);
