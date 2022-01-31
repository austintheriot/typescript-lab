import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type ToNumber<T> = T extends number ? T : never;

checks([
  check<ToNumber<number>, number, Test.Pass>(),
  check<ToNumber<1>, 1, Test.Pass>(),
  check<ToNumber<"Hello">, never, Test.Pass>(),
]);
