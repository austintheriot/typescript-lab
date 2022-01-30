import { Test } from 'ts-toolbelt';
import { PopTuple } from './PopTuple';
import { NewTuple } from './NewTuple';
const { checks, check } = Test;

/** Remove elements from both arrays until one is empty */
type _GreaterThan<A1, A2> =
  A1 extends number[]
  ? A2 extends number[]
  ? (A1['length'] extends A2['length']
    ? false
    : A1['length'] extends 0
    ? false
    : A2['length'] extends 0
    ? true
    : _GreaterThan<PopTuple<A1>, PopTuple<A2>>
  ) : never
  : never;

export type GreaterThan<N1, N2> = _GreaterThan<NewTuple<N1>, NewTuple<N2>>;

checks([
  check<GreaterThan<1, 1>, false, Test.Pass>(),
  check<GreaterThan<2, 1>, true, Test.Pass>(),
  check<GreaterThan<1, 2>, false, Test.Pass>(),
]);
