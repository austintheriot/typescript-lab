import { Test } from 'ts-toolbelt';
import { IsNegative } from './isNegative';
import { ParseInt } from "./ParseNumber";
import { ShiftString } from "./ShiftString";
const { checks, check } = Test;

export type InvertInteger<N extends unknown> =
  N extends 0
  ? 0 
  : N extends number ? (
  IsNegative<N> extends true ? ParseInt<ShiftString<`${N}`>> : ParseInt<`-${N}`>
) : never;

checks([
	// should invert all positive and negative single-digit integers
	check<InvertInteger<-9>, 9, Test.Pass>(),
	check<InvertInteger<-8>, 8, Test.Pass>(),
	check<InvertInteger<-7>, 7, Test.Pass>(),
	check<InvertInteger<-6>, 6, Test.Pass>(),
	check<InvertInteger<-5>, 5, Test.Pass>(),
	check<InvertInteger<-4>, 4, Test.Pass>(),
	check<InvertInteger<-3>, 3, Test.Pass>(),
	check<InvertInteger<-2>, 2, Test.Pass>(),
	check<InvertInteger<-1>, 1, Test.Pass>(),
	check<InvertInteger<0>, 0, Test.Pass>(),
	check<InvertInteger<1>, -1, Test.Pass>(),
	check<InvertInteger<2>, -2, Test.Pass>(),
	check<InvertInteger<3>, -3, Test.Pass>(),
	check<InvertInteger<4>, -4, Test.Pass>(),
	check<InvertInteger<5>, -5, Test.Pass>(),
	check<InvertInteger<6>, -6, Test.Pass>(),
	check<InvertInteger<7>, -7, Test.Pass>(),
	check<InvertInteger<8>, -8, Test.Pass>(),
  check<InvertInteger<9>, -9, Test.Pass>(),
  
  // should reject bogus input
	check<InvertInteger<-90>, never, Test.Pass>(),
	check<InvertInteger<100>, never, Test.Pass>(),
	check<InvertInteger<boolean>, never, Test.Pass>(),
	check<InvertInteger<'example'>, never, Test.Pass>(),
  check<InvertInteger<string | boolean>, never, Test.Pass>(),
  
  // BONUS: converts union types as well
	check<InvertInteger<1 | 2 | 3>, -1 | -2 | -3, Test.Pass>(),
	check<InvertInteger<-9 | 0 | 5>, 9 | 0 | -5, Test.Pass>(),
]);
