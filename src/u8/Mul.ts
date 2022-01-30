import { Test } from 'ts-toolbelt';
import { Add } from './Add';
import { Dec } from './Dec';
const { checks, check } = Test;

/** Helper function, preservers original left operand when multiplying recursively */
type _Mul<N1, N2, OriginalN1> = N2 extends 1 ? N1 : _Mul<Add<N1, OriginalN1>, Dec<N2>, OriginalN1>;

type Mul<N1, N2> = N2 extends 0
  ? 0
  : N2 extends 1
  ? N1 : _Mul<N1, N2, N1>;

checks([
  check<Mul<1, 0>, 0, Test.Pass>(),
  check<Mul<1, 1>, 1, Test.Pass>(),
  check<Mul<7, 2>, 14, Test.Pass>(),
  check<Mul<13, 10>, 130, Test.Pass>(),
]);
