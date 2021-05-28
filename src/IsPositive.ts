import { Test } from 'ts-toolbelt';
import { IsZeroOrPositiveInteger } from './IsZeroOrPositiveInteger';
import { IsPlainNumber } from './IsPlainNumber';
const { checks, check } = Test;

/**
 * Allows both positive numbers and the generic number type.
 * Used to verify negative numbers and plain numbers.
 */
export type IsPlainNumberOrPositive<N extends number> = N extends 0
	? false
	: IsZeroOrPositiveInteger<N>;

checks([
	// should return true if a number is a positive integer
	check<IsPlainNumberOrPositive<1000>, true, Test.Pass>(),
	check<IsPlainNumberOrPositive<5>, true, Test.Pass>(),
	check<IsPlainNumberOrPositive<1>, true, Test.Pass>(),

	// should return true if a number is a positive float
	check<IsPlainNumberOrPositive<1000.123>, true, Test.Pass>(),
	check<IsPlainNumberOrPositive<5.0>, true, Test.Pass>(),
	check<IsPlainNumberOrPositive<1.9999>, true, Test.Pass>(),

	// should return false for 0 and negative numbers
	check<IsPlainNumberOrPositive<0>, false, Test.Pass>(),
	check<IsPlainNumberOrPositive<-1>, false, Test.Pass>(),
	check<IsPlainNumberOrPositive<-100>, false, Test.Pass>(),

	// should return false for plain number type
	check<IsPlainNumberOrPositive<number>, false, Test.Pass>(),
]);

export type IsPositive<N extends number> = IsPlainNumber<N> extends true
	? never
	: IsPlainNumberOrPositive<N>;

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

	// should reject plain number type
	check<IsPositive<number>, never, Test.Pass>(),
]);
