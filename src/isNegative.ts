import { Test } from 'ts-toolbelt';
import { Split } from 'ts-toolbelt/out/String/_api';
import { IsPlainNumberOrPositive } from './IsPositive';
const { checks, check } = Test;

export type IsNegative<N extends number> = N extends 0
	? false
	: Split<`${N}`>[0] extends '-'
	? true
	: IsPlainNumberOrPositive<N> extends true
	? false
	: never;

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

	// should reject plain number type
	check<IsNegative<number>, never, Test.Pass>(),
]);
