import { Test } from 'ts-toolbelt';
import { NewTuple } from './NewTuple';
const { checks, check } = Test;

export type Sub<N1, N2> = NewTuple<N1> extends [...(infer Result), ...NewTuple<N2>] ? Result['length'] : 0;

checks([
  check<Sub<1, 1>, 0, Test.Pass>(),
  check<Sub<8, 4>, 4, Test.Pass>(),
  check<Sub<57, 56>, 1, Test.Pass>(),

  // subtraction past 0 should just return 0
  check<Sub<11, 12>, 0, Test.Pass>(),

  // edge cases
  check<Sub<0, 0>, 0, Test.Pass>(),
]);
