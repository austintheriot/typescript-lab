import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type Or<A extends boolean, B extends boolean> = true extends A | B ? true : false;

checks([
  check<Or<true, true>, true, Test.Pass>(),
  check<Or<true, false>, true, Test.Pass>(),
  check<Or<false, true>, true, Test.Pass>(),
  check<Or<false, false>, false, Test.Pass>(),
]);


export type And<A extends boolean, B extends boolean> = [A, B] extends [true, true] ? true : false;

checks([
  check<And<true, true>, true, Test.Pass>(),
  check<And<true, false>, false, Test.Pass>(),
  check<And<false, true>, false, Test.Pass>(),
  check<And<false, false>, false, Test.Pass>(),
]);


export type Not<A> = A extends true ? false : true;

checks([
  check<Not<true>, false, Test.Pass>(),
  check<Not<false>, true, Test.Pass>(),
]);
