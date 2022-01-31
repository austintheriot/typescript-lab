import { Test } from 'ts-toolbelt';
import { Sub } from './Sub';
const { checks, check } = Test;

type Mod<N1, N2> = 
  // cannot divide by 0
  N2 extends 0
  ? never
  
  // divide by itself = 1
  : N2 extends N1
  ? 0

  // subtracting 1 more would result in 0 or < 0
  // so return the remainder
  : Sub<N1, N2> extends 0
  ? N1

  : Mod<Sub<N1, N2>, N2>;

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
