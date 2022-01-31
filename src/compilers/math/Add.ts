import { Test } from 'ts-toolbelt';
import { NewTuple } from './NewTuple';
const { checks, check } = Test;

export type Add<N1, N2> = [...NewTuple<N1>, ...NewTuple<N2>]['length']

checks([
  check<Add<0, 1>, 1, Test.Pass>(),
  check<Add<1, 7>, 8, Test.Pass>(),
  check<Add<10, 13>, 23, Test.Pass>(),
  check<Add<600, 600>, 1200, Test.Pass>(),
]);
