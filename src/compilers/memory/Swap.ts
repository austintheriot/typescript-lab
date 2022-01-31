import { Test } from 'ts-toolbelt';
import { Unique } from '../utils/Unique';
import { Write } from './Write';
const { checks, check } = Test;

type Uninitialized = Unique<'uninitialized'>;

export type Swap<
  Memory extends unknown[],
  Index1 extends number,
  Index2 extends number,
  A extends unknown = Uninitialized,
  B extends unknown = Uninitialized,
  > =
 (A | B) extends Uninitialized
  // have not retrieved data from memory
  ? Swap<Memory, Index1, Index2, Memory[Index1], Memory[Index2]>
  : Write<Write<Memory, Index2, A>, Index1, B>;

checks([
  // should work with plain numbers (indexes in-bounds)
  check<Swap<[0, 1, 2, 3, 4, 5], 0, 1>, [1, 0, 2, 3, 4, 5], Test.Pass>(),
  check<Swap<[0, 1, 2, 3, 4, 5], 3, 1>, [0, 3, 2, 1, 4, 5], Test.Pass>(),

  // should work with disparate types
  check<Swap<[undefined, null, 'hello', Error, 1, `${number}`], 2, 3>, [undefined, null, Error, 'hello', 1, `${number}`], Test.Pass>(),

  // no safe guards on out-of-range indexes (for speed of execution)
  check<Swap<[0, 1, 2, 3, 4, 5], 6, 1>, [0, undefined, 2, 3, 4, 5], Test.Pass>(),
  check<Swap<[0, 1, 2, 3, 4, 5], 10, 11>, [0, 1, 2, 3, 4, 5], Test.Pass>(),
]);
