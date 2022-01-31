import { Test } from "ts-toolbelt";
import { ShiftTuple } from './ShiftTuple';
const { checks, check } = Test;

type Operator<X> = X | null;

/** Applies the Operator to each element in the tuple.
 * This is more of a proof of concept than anything, since a generic cannot be passed in
 * as an argument for another generic and so cannot be reused in different ForEach functions */
export type ForEach<A extends unknown[], StorageTuple extends unknown[] = []> = A['length'] extends 0
  ? StorageTuple : ForEach<ShiftTuple<A>, [...StorageTuple, Operator<A[0]>]>;

checks([
	// given a number, should make a tuple of that length
	check<ForEach<[0, 1, 2]>, [0 | null, 1 | null, 2 | null], Test.Pass>(),
	check<ForEach<['a', 'b', 'c']>, ['a' | null, 'b' | null, 'c' | null], Test.Pass>(),
	check<ForEach<[undefined]>, [undefined | null], Test.Pass>(),
]);
