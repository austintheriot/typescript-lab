import { Test } from 'ts-toolbelt';
import { IsTemplateLiteral } from './IsTemplateLiteral';
const { checks, check } = Test;

/**
 * Returns the first character from a string.
 */
export type FirstCharacter<S extends string> = IsTemplateLiteral<S> extends true
	? S extends `${infer First}${string}`
		? First
		: S
	: never;

checks([
	// should return the last character from a template literal
	check<FirstCharacter<'a'>, 'a', Test.Pass>(),
	check<FirstCharacter<'ab'>, 'a', Test.Pass>(),
	check<FirstCharacter<'abc'>, 'a', Test.Pass>(),
	check<FirstCharacter<'Hello world!'>, 'H', Test.Pass>(),

	// should return itself when given an empty string
  check<FirstCharacter<''>, '', Test.Pass>(),
  
  // should reject plain string type
  check<FirstCharacter<string>, never, Test.Pass>(),

]);
