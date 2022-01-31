import { Test } from 'ts-toolbelt';
import { Dec } from './Dec';
const { checks, check } = Test;

export type GreaterThan<N1, N2> =
  N1 extends N2
  ? false
  : N1 extends 0
  ? false
  : N2 extends 0
  ? true
  : GreaterThan<Dec<N1>, Dec<N2>>;

checks([
  check<GreaterThan<1, 1>, false, Test.Pass>(),
  check<GreaterThan<2, 1>, true, Test.Pass>(),
  check<GreaterThan<1, 2>, false, Test.Pass>(),
]);
