import { Test } from 'ts-toolbelt';
const { checks, check } = Test;
import { Write } from './Write';
import { GreaterThanOrEqualTo } from '../math/GreaterThanOrEqualTo';
import { Inc } from '../math/Inc';

export type IncAtIndex<Memory, Index> =
  Memory extends number[] ? (
    Index extends number ?
    (
      GreaterThanOrEqualTo<Index, Memory['length']> extends true
      ? Memory
      : Write<Memory, Index, Inc<Memory[Index]>>
    ) : never
  ) : never;

checks([
  // should work with 0
  check<IncAtIndex<[0, 0, 0, 0, 0], 0>, [1, 0, 0, 0, 0], Test.Pass>(),
  check<IncAtIndex<[0, 0, 0, 0, 0], 1>, [0, 1, 0, 0, 0], Test.Pass>(),
  check<IncAtIndex<[0, 0, 0, 0, 0], 2>, [0, 0, 1, 0, 0], Test.Pass>(),
  check<IncAtIndex<[0, 0, 0, 0, 0], 3>, [0, 0, 0, 1, 0], Test.Pass>(),
  check<IncAtIndex<[0, 0, 0, 0, 0], 4>, [0, 0, 0, 0, 1], Test.Pass>(),

  // should work with other numbers
  check<IncAtIndex<[10, 0, 0, 0, 0], 0>, [11, 0, 0, 0, 0], Test.Pass>(),
  check<IncAtIndex<[0, 15, 0, 0, 0], 1>, [0, 16, 0, 0, 0], Test.Pass>(),
  check<IncAtIndex<[0, 0, 31, 0, 0], 2>, [0, 0, 32, 0, 0], Test.Pass>(),
  check<IncAtIndex<[0, 0, 0, 11, 0], 3>, [0, 0, 0, 12, 0], Test.Pass>(),
  check<IncAtIndex<[0, 0, 0, 0, 0], 4>, [0, 0, 0, 0, 1], Test.Pass>(),

  // out of range: nop
  check<IncAtIndex<[0, 0, 0, 0, 0], 5>, [0, 0, 0, 0, 0], Test.Pass>(),
]);
