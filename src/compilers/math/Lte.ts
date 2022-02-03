import { Test } from 'ts-toolbelt';
import { Lt } from './Lt';
const { checks, check } = Test;

/** LessThanOrEqualTo, but returns 0 | 1 instead of true | false */
export type Lte<N1 extends number, N2 extends number> = N1 extends N2
  ? 1
  : Lt<N1, N2>
  ? 1
  : 0;

checks([
  check<Lte<1, 1>, 1, Test.Pass>(),
  check<Lte<2, 1>, 0, Test.Pass>(),
  check<Lte<1, 2>, 1, Test.Pass>(),
]);
