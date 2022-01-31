import { Test } from 'ts-toolbelt';
const { checks, check } = Test;


export type IsPositive<N extends number> = N extends 0
	? false
	: `${N}` extends `-${number}`
	? false
	: true;


checks([
	// should return true if a number is a positive integer
	check<IsPositive<1000>, true, Test.Pass>(),
	check<IsPositive<5>, true, Test.Pass>(),
	check<IsPositive<1>, true, Test.Pass>(),

	// should return true if a number is a positive float
	check<IsPositive<1000.123>, true, Test.Pass>(),
	check<IsPositive<5.0>, true, Test.Pass>(),
	check<IsPositive<1.9999>, true, Test.Pass>(),

	// should return false for 0, generic numbers, and negative numbers
	check<IsPositive<0>, false, Test.Pass>(),
	check<IsPositive<-1>, false, Test.Pass>(),
	check<IsPositive<-100>, false, Test.Pass>(),

	// should reject plain number type ? (undefined behavior)
	check<IsPositive<number>, true, Test.Pass>(),
]);
