import { Test } from "ts-toolbelt";
const { checks, check } = Test;

/**
 * Corresponds string version of integers to their number equivalents.
 */
export interface Numbers {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
}

/**
 * Converts a single digit integer string into it's corresponding number.
 */
export type ParseInt<S extends unknown> = S extends `${infer N}` ? (
  N extends keyof Numbers ? Numbers[N] : never
) : never;

checks([
  // should infer the integer correctly
  check<ParseInt<'0'>, 0, Test.Pass>(),
  check<ParseInt<'1'>, 1, Test.Pass>(),
  check<ParseInt<'2'>, 2, Test.Pass>(),
  check<ParseInt<'3'>, 3, Test.Pass>(),
  check<ParseInt<'4'>, 4, Test.Pass>(),
  check<ParseInt<'5'>, 5, Test.Pass>(),
  check<ParseInt<'6'>, 6, Test.Pass>(),
  check<ParseInt<'7'>, 7, Test.Pass>(),
  check<ParseInt<'8'>, 8, Test.Pass>(),
  check<ParseInt<'9'>, 9, Test.Pass>(),

  // should return never for bogus types
  check<ParseInt<string>, never, Test.Pass>(),
  check<ParseInt<'a'>, never, Test.Pass>(),
  check<ParseInt<boolean>, never, Test.Pass>(),
  check<ParseInt<'12'>, never, Test.Pass>(),
  check<ParseInt<1>, never, Test.Pass>(),
  check<ParseInt<1.5>, never, Test.Pass>(),
]);
