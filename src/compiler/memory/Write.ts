import { Test } from 'ts-toolbelt';
const { checks, check } = Test;
import { Before } from './Before';
import { After } from './After';
import { GreaterThanOrEqualTo } from '../math/GreaterThanOrEqualTo';

export type Write<Memory extends number[], Index, Value> =
  Value extends number ? (
    Index extends number ? (
      GreaterThanOrEqualTo<Index, Memory['length']> extends true
      ? Memory
      : [...Before<Memory, Index>, Value, ...After<Memory, Index>]
    )
    : never
  )
  : never;

checks([
  check<Write<[0, 0, 0, 0, 0], 1, 6>, [0, 6, 0, 0, 0], Test.Pass>(),
  check<Write<[100, 99, 98, 97, 96], 0, 1000>, [1000, 99, 98, 97, 96], Test.Pass>(),

  // index is out of range: nop
  check<Write<[0, 0, 0, 0, 0], 6, 1>, [0, 0, 0, 0, 0], Test.Pass>(),
  check<Write<[100, 99, 98, 97, 96], 5, 1000>, [100, 99, 98, 97, 96], Test.Pass>(),
]);
