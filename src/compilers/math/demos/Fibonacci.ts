import { Test } from 'ts-toolbelt';
import { Add } from "../math/Add";
import { Dec } from "../math/Dec";
const { checks, check } = Test;

type Fibonacci<N extends number = 0, A = 0, B = 1> = N extends 0
  ? A
  : Fibonacci<Dec<N>, B, Add<A, B>>;

checks([
  check<Fibonacci<0>, 0, Test.Pass>(),
  check<Fibonacci<1>, 1, Test.Pass>(),
  check<Fibonacci<2>, 1, Test.Pass>(),
  check<Fibonacci<3>, 2, Test.Pass>(),
  check<Fibonacci<4>, 3, Test.Pass>(),
  check<Fibonacci<5>, 5, Test.Pass>(),
  check<Fibonacci<6>, 8, Test.Pass>(),
  check<Fibonacci<7>, 13, Test.Pass>(),
  check<Fibonacci<8>, 21, Test.Pass>(),
  check<Fibonacci<9>, 34, Test.Pass>(),
  check<Fibonacci<10>, 55, Test.Pass>(),
  check<Fibonacci<11>, 89, Test.Pass>(),
  check<Fibonacci<12>, 144, Test.Pass>(),
  check<Fibonacci<13>, 233, Test.Pass>(),
  check<Fibonacci<14>, 377, Test.Pass>(),
  check<Fibonacci<15>, 610, Test.Pass>(),
  check<Fibonacci<16>, 987, Test.Pass>(),

  // max recursion limit reached on anything higher than this ^
]);
