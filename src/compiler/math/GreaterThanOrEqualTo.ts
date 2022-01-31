import { Test } from 'ts-toolbelt';
import { GreaterThan } from './GreaterThan';
const { checks, check } = Test;

export type GreaterThanOrEqualTo<N1, N2> = N1 extends N2
  ? true
  : GreaterThan<N1, N2>
  ? true
  : false;

checks([
  check<GreaterThanOrEqualTo<1, 1>, true, Test.Pass>(),
  check<GreaterThanOrEqualTo<2, 1>, true, Test.Pass>(),
  check<GreaterThanOrEqualTo<1, 2>, false, Test.Pass>(),
]);
