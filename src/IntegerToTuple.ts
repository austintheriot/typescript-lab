import { Test } from 'ts-toolbelt';
const { checks, check } = Test;
import { MakeIndexes } from './MakeIndexes';

export type IntegerToTuple<Length extends number> = MakeIndexes<
	Length,
	'tuple'
>;

checks([
	// given a number, should make a tuple of that length
	check<IntegerToTuple<1>['length'], 1, Test.Pass>(),
	check<IntegerToTuple<5>['length'], 5, Test.Pass>(),
	check<IntegerToTuple<25>['length'], 25, Test.Pass>(),
]);
