import { Test } from 'ts-toolbelt';
import { NewTuple } from './NewTuple';
const { checks, check } = Test;


export type Dec<N> = NewTuple<N> extends [infer _Head, ...infer Rest] ? Rest['length'] : never;

checks([
  check<Dec<0>, never, Test.Pass>(),
  check<Dec<1>, 0, Test.Pass>(),
  check<Dec<10>, 9, Test.Pass>(),
  // check<Dec<850>, 849, Test.Pass>(),
]);
