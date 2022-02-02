import { Test } from 'ts-toolbelt';
import { U8Dec } from './U8Dec';
const { checks, check } = Test;

export type U8Sub<N1 extends number, N2 extends number> = N2 extends 0 ? N1 : U8Sub<U8Dec<N1>, U8Dec<N2>>;

checks([
  check<U8Sub<0, 1>, 255, Test.Pass>(),
  check<U8Sub<7, 1>, 6, Test.Pass>(),
  check<U8Sub<13, 5>, 8, Test.Pass>(),
  check<U8Sub<255, 10>, 245, Test.Pass>(),
]);
