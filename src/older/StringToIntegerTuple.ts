import { Test } from 'ts-toolbelt';
import { Split } from 'ts-toolbelt/out/String/_api';
import { ParseInt } from './ParseNumber';
import { ShiftString } from './ShiftString';
const { checks, check } = Test;

/**
 * Converts an integer string into to a tuple of integers.
 * 
 * @example
 * '123' --> [1, 2, 3]
 * '98765' --> [9, 8, 7, 6, 5]
 */
export type StringToIntegerTuple<
	S extends unknown,
	_Tuple extends number[] = [],
> = S extends string
	? S extends ''
		? _Tuple
		: StringToIntegerTuple<ShiftString<S>, [..._Tuple, ParseInt<Split<S>[0]>]>
	: never;

checks([
	// should covert an integer string into a tuple of integers
	check<StringToIntegerTuple<'0'>, [0], Test.Pass>(),
	check<StringToIntegerTuple<'12'>, [1, 2], Test.Pass>(),
	check<StringToIntegerTuple<'555'>, [5, 5, 5], Test.Pass>(),
	check<StringToIntegerTuple<'1000'>, [1, 0, 0, 0], Test.Pass>(),
	check<StringToIntegerTuple<'99000'>, [9, 9, 0, 0, 0], Test.Pass>(),
	check<StringToIntegerTuple<'123456'>, [1, 2, 3, 4, 5, 6], Test.Pass>(),
	check<
		StringToIntegerTuple<'9876543210'>,
		[9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
		Test.Pass
	>(),
]);
