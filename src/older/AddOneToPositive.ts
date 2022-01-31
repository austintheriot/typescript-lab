import { Test } from 'ts-toolbelt';
const { checks, check } = Test;
import { IntegerToTuple } from './IntegerToTuple';
import { IsZeroOrPositiveInteger } from './IsZeroOrPositiveInteger';

/**
 * Given a 0 or positive integer, adds one.
 */
export type AddOneToPositive<N extends number> =
	IsZeroOrPositiveInteger<N> extends true
		? [...IntegerToTuple<N>, 0]['length']
		: never;

checks([
	// adds 1
	check<AddOneToPositive<0>, 1, Test.Pass>(),
	check<AddOneToPositive<1>, 2, Test.Pass>(),
	check<AddOneToPositive<5>, 6, Test.Pass>(),
	check<AddOneToPositive<25>, 26, Test.Pass>(),

	// should reject plain number type
	check<AddOneToPositive<number>, never, Test.Pass>(),

	// should reject negative numbers
	check<AddOneToPositive<-1>, never, Test.Pass>(),
	check<AddOneToPositive<-50>, never, Test.Pass>(),
	check<AddOneToPositive<-100>, never, Test.Pass>(),
	check<AddOneToPositive<-1000>, never, Test.Pass>(),
]);
