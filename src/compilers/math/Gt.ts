import { Test } from 'ts-toolbelt';
import { U8Dec } from './U8Dec';
const { checks, check } = Test;

/** GreaterThan, but returns 0 | 1 instead of true | false */
export type Gt<N1 extends number, N2 extends number> =
  N1 extends N2
  ? 0
  : N1 extends 0
  ? 0
  : N2 extends 0
  ? 1
  : Gt<U8Dec<N1>, U8Dec<N2>>;

checks([
  check<Gt<1, 1>, 0, Test.Pass>(),
  check<Gt<2, 1>, 1, Test.Pass>(),
  check<Gt<1, 2>, 0, Test.Pass>(),
]);
