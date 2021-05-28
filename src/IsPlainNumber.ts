import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type IsPlainNumber<N extends number> = [][N] extends never
	? true
	: false;

export type IsSpecificNumber<N extends number> = IsPlainNumber<N> extends true
	? false
	: true;

checks([
	// should return true if a number is of plain "number" type
	check<IsPlainNumber<1000>, false, Test.Pass>(),
	check<IsPlainNumber<5>, false, Test.Pass>(),
	check<IsPlainNumber<1>, false, Test.Pass>(),
	check<IsPlainNumber<number>, true, Test.Pass>(),

	// should return true if a number is a specific number like 1 or 2
	check<IsSpecificNumber<1000>, true, Test.Pass>(),
	check<IsSpecificNumber<5>, true, Test.Pass>(),
	check<IsSpecificNumber<1>, true, Test.Pass>(),
	check<IsSpecificNumber<number>, false, Test.Pass>(),

	// @todo: currently doesn't support negative numbers
]);
