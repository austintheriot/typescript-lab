import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type IsZeroOrPositiveInteger<N extends number> = [][N] extends never
	? false
	: true;

checks([
	// should return true if a number is a positive integer or 0
	check<IsZeroOrPositiveInteger<1000>, true, Test.Pass>(),
	check<IsZeroOrPositiveInteger<5>, true, Test.Pass>(),
	check<IsZeroOrPositiveInteger<1>, true, Test.Pass>(),
	check<IsZeroOrPositiveInteger<0>, true, Test.Pass>(),

	// should return false if number is a negative integer
	check<IsZeroOrPositiveInteger<-1>, false, Test.Pass>(),
	check<IsZeroOrPositiveInteger<-50>, false, Test.Pass>(),
	check<IsZeroOrPositiveInteger<-1000>, false, Test.Pass>(),

	// should reject plain number types
	check<IsZeroOrPositiveInteger<number>, never, Test.Fail>(),
]);