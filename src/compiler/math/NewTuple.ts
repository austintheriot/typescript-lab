import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type NewTuple<Length, StorageTuple extends 0[] = []> = StorageTuple['length'] extends Length
  ? StorageTuple
  : NewTuple<Length, [...StorageTuple, 0]>;

checks([
  check<NewTuple<0>, [], Test.Pass>(),
  check<NewTuple<1>, [0], Test.Pass>(),
  check<NewTuple<10>, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], Test.Pass>(),
]);

