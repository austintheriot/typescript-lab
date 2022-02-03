import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type Neq<N1 extends number, N2 extends number> =
  N1 extends N2
  ? N2 extends N1 ? 0 : 1
  : 1;
checks([
  check<Neq<1, 1>, 0, Test.Pass>(),
  check<Neq<2, 1>, 1, Test.Pass>(),
  check<Neq<1, 2>, 1, Test.Pass>(),

  // edge cases
  check<Neq<number, number>, 1, Test.Pass>(),
]);
