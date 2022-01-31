import { Test } from 'ts-toolbelt';
import { Dec } from './Dec';
const { checks, check } = Test;

export type LessThan<N1, N2> =
  N1 extends N2
  ? false
  : N1 extends 0
  ? true
  : N2 extends 0
  ? false
  : LessThan<Dec<N1>, Dec<N2>>;

checks([
  check<LessThan<1, 1>, false, Test.Pass>(),
  check<LessThan<2, 1>, false, Test.Pass>(),
  check<LessThan<1, 2>, true, Test.Pass>(),
]);
