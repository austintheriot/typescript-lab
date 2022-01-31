import { Test } from 'ts-toolbelt';
import { NewTuple } from './NewTuple';
import { ToNumber } from './ToNumber';
const { checks, check } = Test;

// wrapped ToNumber here, since TS thinks this does not always return a number
export type Inc<N> = ToNumber<[...NewTuple<N>, 0]['length']>;

checks([
  check<Inc<0>, 1, Test.Pass>(),
  check<Inc<1>, 2, Test.Pass>(),
  check<Inc<10>, 11, Test.Pass>(),
  // check<Inc<850>, 851, Test.Pass>(),
]);
