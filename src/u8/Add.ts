import { Test } from 'ts-toolbelt';
import { Inc } from './Inc';
import { Dec } from './Dec';
const { checks, check } = Test;

export type Add<N1, N2> = N2 extends 0 ? N1 : Add<Inc<N1>, Dec<N2>>;

checks([
  check<Add<0, 1>, 1, Test.Pass>(),
  check<Add<1, 7>, 8, Test.Pass>(),
  check<Add<10, 13>, 23, Test.Pass>(),
  // check<Add<499, 488>, never, Test.Pass>(),
]);
