import { Test } from 'ts-toolbelt';
import { Add } from "../math/Add";
import { Dec } from "../math/Dec";
const { checks, check } = Test;

type _Fibonacci<A, B, N = 0> = N extends 0
  ? A
  : _Fibonacci<B, Add<A, B>, Dec<N>>;

type Fibonacci<N = 0> = _Fibonacci<0, 1, N>;


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
]);
