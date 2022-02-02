import { Test } from 'ts-toolbelt';
import { U8Dec } from './U8Dec';
import { U8Inc } from './U8Inc';
const { checks, check } = Test;

export type U8Add<N1 extends number, N2 extends number> = N2 extends 0 ? N1 : U8Add<U8Inc<N1>, U8Dec<N2>>;

checks([
  check<U8Add<0, 1>, 1, Test.Pass>(),
  check<U8Add<1, 7>, 8, Test.Pass>(),
  check<U8Add<10, 13>, 23, Test.Pass>(),
  check<U8Add<255, 2>, 1, Test.Pass>(),
]);
