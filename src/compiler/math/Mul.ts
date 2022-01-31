import { Test } from 'ts-toolbelt';
import { Add } from './Add';
import { Dec } from './Dec';
const { checks, check } = Test;

/** Repeatedly add N1 together while decrementing N2 until it reaches 1 */
type _Mul<N1, N2, OriginalN1> = N2 extends 1 ? N1 : _Mul<Add<N1, OriginalN1>, Dec<N2>, OriginalN1>;

type Mul<N1, N2> =
  // multiplication by 0 = 0
  N2 extends 0
  ? 0
  // multiplication by 1 = original number
  : N2 extends 1
  ? N1 : _Mul<N1, N2, N1>;

checks([
  check<Mul<1, 0>, 0, Test.Pass>(),
  check<Mul<1, 1>, 1, Test.Pass>(),
  check<Mul<7, 2>, 14, Test.Pass>(),
  check<Mul<13, 10>, 130, Test.Pass>(),
  check<Mul<200, 5>, 1000, Test.Pass>(),
]);
