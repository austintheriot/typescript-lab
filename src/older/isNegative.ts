import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type IsNegative<N extends number> = N extends 0
	? false
	: `${N}` extends `-${number}`
	? true
	: false;

checks([
	// should return true for negative integers
	check<IsNegative<-1>, true, Test.Pass>(),
	check<IsNegative<-50>, true, Test.Pass>(),
	check<IsNegative<-100>, true, Test.Pass>(),
	check<IsNegative<-1234>, true, Test.Pass>(),

	// should return true for negative floats
	check<IsNegative<-0.9999>, true, Test.Pass>(),
	check<IsNegative<-1.1234>, true, Test.Pass>(),
	check<IsNegative<-100.0987>, true, Test.Pass>(),
	check<IsNegative<-1234.0000>, true, Test.Pass>(),

	// should return false for 0, generic numbers, and positive numbers
	check<IsNegative<0>, false, Test.Pass>(),
	check<IsNegative<1000>, false, Test.Pass>(),
	check<IsNegative<5>, false, Test.Pass>(),
	check<IsNegative<1.1234>, false, Test.Pass>(),
	check<IsNegative<100.000009>, false, Test.Pass>(),

	// should reject plain number type ? (undefined behavior)
	check<IsNegative<number>, false, Test.Pass>(),
]);
