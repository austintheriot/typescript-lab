import { Test } from 'ts-toolbelt';
import { LessThan } from './LessThan';
const { checks, check } = Test;

export type LessThanOrEqualTo<A1, A2> = A1 extends A2
  ? true
  : LessThan<A1, A2>
  ? true
  : false;

checks([
  check<LessThanOrEqualTo<1, 1>, true, Test.Pass>(),
  check<LessThanOrEqualTo<2, 1>, false, Test.Pass>(),
  check<LessThanOrEqualTo<1, 2>, true, Test.Pass>(),
]);
