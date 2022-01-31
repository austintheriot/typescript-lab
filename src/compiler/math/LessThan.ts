import { Test } from 'ts-toolbelt';
import { PopTuple } from './PopTuple';
import { NewTuple } from './NewTuple';
const { checks, check } = Test;

/** Remove elements from both arrays until one is empty */
type _LessThan<A1 extends number[], A2 extends number[]> =
  A1['length'] extends A2['length']
  ? false
  : A1['length'] extends 0
  ? true
  : A2['length'] extends 0
  ? false
  : _LessThan<PopTuple<A1>, PopTuple<A2>>

/** Create tuples from elements and compare tuple lengths */
export type LessThan<N1, N2> = _LessThan<NewTuple<N1>, NewTuple<N2>>;

checks([
  check<LessThan<1, 1>, false, Test.Pass>(),
  check<LessThan<2, 1>, false, Test.Pass>(),
  check<LessThan<1, 2>, true, Test.Pass>(),
]);
