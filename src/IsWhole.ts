import { Test } from 'ts-toolbelt';
const { checks, check } = Test;


export type IsWhole<N extends number> = `${N}` extends `${number}.${number}`
	? false
	: true;


checks([
	// should return true if a number is a positive integer
	check<IsWhole<1000>, true, Test.Pass>(),
	check<IsWhole<5>, true, Test.Pass>(),
	check<IsWhole<1>, true, Test.Pass>(),

	// 0
	check<IsWhole<0>, true, Test.Pass>(),

	// negative integers
	check<IsWhole<-1>, true, Test.Pass>(),
	check<IsWhole<-5>, true, Test.Pass>(),
	check<IsWhole<-100>, true, Test.Pass>(),

	// should return true for decimals that are actually whole numbers (i.e. they are rounded)
	check<IsWhole<5.0>, true, Test.Pass>(),

	// should return false if a number is a positive float
	check<IsWhole<1000.123>, false, Test.Pass>(),
	check<IsWhole<1.9999>, false, Test.Pass>(),

	// should return false if number is a negative float
	check<IsWhole<-1000.123>, false, Test.Pass>(),
	check<IsWhole<-1.9999>, false, Test.Pass>(),

	// should reject plain number type ? (undefined behavior)
	check<IsWhole<number>, true, Test.Pass>(),
]);
