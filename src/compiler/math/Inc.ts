import { Test } from 'ts-toolbelt';
import { NewTuple } from './NewTuple';
const { checks, check } = Test;

export type Inc<N> = [...NewTuple<N>, 0]['length'];

checks([
  check<Inc<0>, 1, Test.Pass>(),
  check<Inc<1>, 2, Test.Pass>(),
  check<Inc<10>, 11, Test.Pass>(),
  // check<Inc<850>, 851, Test.Pass>(),
]);
