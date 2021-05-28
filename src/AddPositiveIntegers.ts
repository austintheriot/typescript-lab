import { Test } from 'ts-toolbelt';
const { checks, check } = Test;
import { IntegerToTuple } from './IntegerToTuple';

/**
 * Adds two positive integers together.
 * Note: TypeScript currently guards against sums greater than about 80.
 */
export type AddPositiveIntegers<
	Number1 extends number,
	Number2 extends number
> = [...IntegerToTuple<Number1>, ...IntegerToTuple<Number2>]['length'];

checks([
	// should correctly add two positive numbers
	check<AddPositiveIntegers<0, 0>, 0, Test.Pass>(),
	check<AddPositiveIntegers<1, 1>, 2, Test.Pass>(),
	check<AddPositiveIntegers<5, 10>, 15, Test.Pass>(),
	check<AddPositiveIntegers<40, 40>, 80, Test.Pass>(),

	// should throw on false additions
	check<AddPositiveIntegers<0, 0>, 1, Test.Fail>(),
	check<AddPositiveIntegers<2, 3>, 6, Test.Fail>(),
	check<AddPositiveIntegers<10, 10>, 10, Test.Fail>(),
]);
