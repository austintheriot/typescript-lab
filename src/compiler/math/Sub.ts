import { Test } from 'ts-toolbelt';
import { Dec } from './Dec';
const { checks, check } = Test;

export type Sub<N1, N2> = N2 extends 0
  // nothing left to subtract
  ? N1
  // cannot subtract from 0
  : N1 extends 0
  ? 0
  : Sub<Dec<N1>, Dec<N2>>;

checks([
  check<Sub<1, 1>, 0, Test.Pass>(),
  check<Sub<8, 4>, 4, Test.Pass>(),
  check<Sub<57, 56>, 1, Test.Pass>(),

  // subtraction past 0 should just return 0
  check<Sub<11, 12>, 0, Test.Pass>(),

  // edge cases
  check<Sub<0, 0>, 0, Test.Pass>(),
]);
