import { Test } from 'ts-toolbelt';
import { GreaterThan } from './GreaterThan';
const { checks, check } = Test;

export type GreaterThanOrEqualTo<A1, A2> = A1 extends A2
  ? true
  : GreaterThan<A1, A2>
  ? true
  : false;

checks([
  check<GreaterThanOrEqualTo<1, 1>, true, Test.Pass>(),
  check<GreaterThanOrEqualTo<2, 1>, true, Test.Pass>(),
  check<GreaterThanOrEqualTo<1, 2>, false, Test.Pass>(),
]);
