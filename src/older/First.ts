import { Test } from 'ts-toolbelt';
import { FirstElement } from './FirstElement';
import { FirstCharacter } from './FirstCharacter';
const { checks, check } = Test;

/**
 * Returns the first element/character from a tuple/string.
 */
export type First<T extends unknown> = T extends string
	? FirstCharacter<T>
	: T extends unknown[]
	? FirstElement<T>
	: never;

checks([
	// if template literal, should return the first character
	check<First<'a'>, 'a', Test.Pass>(),
	check<First<'ab'>, 'a', Test.Pass>(),
	check<First<'abc'>, 'a', Test.Pass>(),
	check<First<'Hello world!'>, 'H', Test.Pass>(),

	// should return itself when given an empty string
	check<First<''>, '', Test.Pass>(),

	// should reject plain string type
	check<First<string>, never, Test.Pass>(),

	// if tuple, should return the first element
	check<First<[number, string, boolean]>, number, Test.Pass>(),
	check<First<[0, 1, 2]>, 0, Test.Pass>(),
	check<First<['']>, '', Test.Pass>(),

	// should return itself when given an empty tuple
	check<First<[]>, [], Test.Pass>(),
]);
