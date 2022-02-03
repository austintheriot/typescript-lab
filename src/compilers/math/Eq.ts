import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type Eq<N1 extends number, N2 extends number> =
  N1 extends N2
  ? N2 extends N1 ? 1 : 0
  : 0;
checks([
  check<Eq<1, 1>, 1, Test.Pass>(),
  check<Eq<2, 1>, 0, Test.Pass>(),
  check<Eq<1, 2>, 0, Test.Pass>(),

  // edge cases
  check<Eq<number, number>, 1, Test.Pass>(),
]);
