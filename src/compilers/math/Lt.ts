import { Test } from 'ts-toolbelt';
import { U8Dec } from './U8Dec';
const { checks, check } = Test;

/** LessThan, but returns 0 | 1 instead of true | false */
export type Lt<N1 extends number, N2 extends number> =
  N1 extends N2
  ? 0
  : N1 extends 0
  ? 1
  : N2 extends 0
  ? 0
  : Lt<U8Dec<N1>, U8Dec<N2>>;

checks([
  check<Lt<1, 1>, 0, Test.Pass>(),
  check<Lt<2, 1>, 0, Test.Pass>(),
  check<Lt<1, 2>, 1, Test.Pass>(),
]);
