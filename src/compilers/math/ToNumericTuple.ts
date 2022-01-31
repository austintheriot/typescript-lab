import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type ToNumericTuple<T> = T extends number[] ? T : never;

checks([
  check<ToNumericTuple<[]>, [], Test.Pass>(),
  check<ToNumericTuple<[number]>, [number], Test.Pass>(),
  check<ToNumericTuple<[0, 1, 2]>, [0, 1, 2], Test.Pass>(),

  check<ToNumericTuple<1>, never, Test.Pass>(),
  check<ToNumericTuple<"Hello">, never, Test.Pass>(),
]);
