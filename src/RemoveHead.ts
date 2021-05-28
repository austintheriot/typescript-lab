import { Test } from 'ts-toolbelt';

const { checks, check } = Test;

/**
 * Removes the first element from a tuple.
 */
export type RemoveHead<
	Tuple extends unknown[], // any tuple
	_TupleStorage extends unknown[] = [], // constructs new tuple
	_IndexStorage extends number[] = [0]
> = Tuple['length'] extends 0 // begins at 1
	? Tuple
	: _IndexStorage['length'] extends Tuple['length']
	? _TupleStorage
	: RemoveHead<
			Tuple, // keep original tuple
			[..._TupleStorage, Tuple[_IndexStorage['length']]], // build new tuple from 1
			[..._IndexStorage, 0] // increase length by 1
	  >;

checks([
	// remove the first element from a tuple
	check<RemoveHead<[number, string, boolean]>, [string, boolean], Test.Pass>(),
	check<RemoveHead<[0, 1, 2]>, [1, 2], Test.Pass>(),
	check<RemoveHead<['']>, [], Test.Pass>(),

	// empty array should return itself
	check<RemoveHead<[]>, [], Test.Pass>(),
]);
