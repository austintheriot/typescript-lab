import { Test } from 'ts-toolbelt';
const { checks, check } = Test;
import { MakeIndexes } from './MakeIndexes';

/**
 * Fills an array to the desired length. By default fills the array with 
 * numbers corresponding to each element's index. i.e. [0, 1, 2, 3, 4, 5]
 */
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
