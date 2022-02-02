import { Test } from 'ts-toolbelt';
import { U8WrappingDecMap } from './IntegerMap';
const { checks, check } = Test;

export type U8Dec<N extends number> = U8WrappingDecMap[N];

checks([
  check<U8Dec<0>, 255, Test.Pass>(),
  check<U8Dec<1>, 0, Test.Pass>(),
  check<U8Dec<100>, 99, Test.Pass>(),
  check<U8Dec<255>, 254, Test.Pass>(),
]);
