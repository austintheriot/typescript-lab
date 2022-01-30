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
  ? N1

  // divide by itself = 1
  : N2 extends N1
  ? 1

  // subtracting 1 more would result in 0 or < 0
  : Sub<N1, N2> extends 0
  ? Counter

  : _Div<Sub<N1, N2>, N2, Inc<Counter>>;

type Div<N1, N2> = _Div<N1, N2, 0>;

checks([
  check<Div<5, 0>, never, Test.Pass>(),
  
  check<Div<5, 1>, 5, Test.Pass>(),
  check<Div<5, 2>, 2, Test.Pass>(),
  check<Div<5, 3>, 1, Test.Pass>(),
  check<Div<5, 4>, 1, Test.Pass>(),
  check<Div<5, 5>, 1, Test.Pass>(),
  
  // decimal = 0 
  check<Div<5, 6>, 0, Test.Pass>(),
  check<Div<5, 7>, 0, Test.Pass>(),
  check<Div<110, 111>, 0, Test.Pass>(),
]);
