import { Test } from 'ts-toolbelt';
import { Sub } from './Sub';
import { Inc } from './Inc';
const { checks, check } = Test;

type _Div<N1, N2, Counter = 0> =
  // cannot divide by 0
  N2 extends 0
  ? never

  // divide by 1 === itself
  : N2 extends 1
  ? 0

  // divide by itself = 1
  : N2 extends N1
  ? 0

  // subtracting 1 more would result in 0 or < 0
  // so return the remainder
  : Sub<N1, N2> extends 0
  ? N1

  : _Div<Sub<N1, N2>, N2, Inc<Counter>>;

type Mod<N1, N2> = _Div<N1, N2, 0>;

checks([
  check<Mod<5, 0>, never, Test.Pass>(),
  
  check<Mod<5, 1>, 0, Test.Pass>(),
  check<Mod<5, 2>, 1, Test.Pass>(),
  check<Mod<5, 3>, 2, Test.Pass>(),
  check<Mod<5, 4>, 1, Test.Pass>(),
  check<Mod<5, 5>, 0, Test.Pass>(),
  
  // a number module something greater should be itself
  check<Mod<5, 6>, 5, Test.Pass>(),
  check<Mod<5, 7>, 5, Test.Pass>(),
  check<Mod<110, 111>, 110, Test.Pass>(),
]);
