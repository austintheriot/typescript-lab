import { Test } from 'ts-toolbelt';
import { Gt } from './Gt';
const { checks, check } = Test;

/** Gte, but returns 0 | 1 instead of true | false */
export type Gte<N1 extends number, N2 extends number> = N1 extends N2
  ? 1
  : Gt<N1, N2>
  ? 1
  : 0;

checks([
  check<Gte<1, 1>, 1, Test.Pass>(),
  check<Gte<2, 1>, 1, Test.Pass>(),
  check<Gte<1, 2>, 0, Test.Pass>(),
]);
