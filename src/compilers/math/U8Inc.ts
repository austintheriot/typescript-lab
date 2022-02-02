import { Test } from 'ts-toolbelt';
import { U8WrappingIncMap } from './IntegerMap';
const { checks, check } = Test;

// wrapped ToNumber here, since TS thinks this does not always return a number
export type U8Inc<N extends number> = U8WrappingIncMap[N];

checks([
  check<U8Inc<0>, 1, Test.Pass>(),
  check<U8Inc<1>, 2, Test.Pass>(),
  check<U8Inc<100>, 101, Test.Pass>(),
  check<U8Inc<255>, 0, Test.Pass>(),
]);
