import { Test } from 'ts-toolbelt';
import { AddOneToPositive } from './AddOneToPositive';
import { InvertInteger } from './InvertInteger';
import { IsNegative } from './isNegative';
import { SubtractOneFromPositive } from './SubtractOneFromPositive';
import { AllSingleIntegers } from './UtilityTypes';
const { checks, check } = Test;
  
/**
 * Because TypeScript is limited in its recursion, this is function is limited
 * to only adding single-digit integers, but if this were not the case, 
 * this process would work on all integers.
 */
export type AddOneToAnySingleInteger<
  N extends unknown
  > =
  N extends AllSingleIntegers ? (
    N extends 0
    ? 1
    : N extends 9
    ? never
    : IsNegative<N> extends true ? InvertInteger<SubtractOneFromPositive<InvertInteger<N>>>
    : AddOneToPositive<N>
  ) : never

checks([
	// should correctly add 1 to negative numbers
	check<AddOneToAnySingleInteger<-1>, 0, Test.Pass>(),
	check<AddOneToAnySingleInteger<-5>, -4, Test.Pass>(),
	check<AddOneToAnySingleInteger<-9>, -8, Test.Pass>(),

	// should correctly add 1 to 0
  check<AddOneToAnySingleInteger<0>, 1, Test.Pass>(),
  
  // should correctly add 1 to positive numbers
	check<AddOneToAnySingleInteger<1>, 2, Test.Pass>(),
	check<AddOneToAnySingleInteger<5>, 6, Test.Pass>(),
  check<AddOneToAnySingleInteger<8>, 9, Test.Pass>(),
  
  // should reject numbers out of range
	check<AddOneToAnySingleInteger<20>, never, Test.Pass>(),
	check<AddOneToAnySingleInteger<15>, never, Test.Pass>(),
	check<AddOneToAnySingleInteger<9>, never, Test.Pass>(),
	check<AddOneToAnySingleInteger<-10>, never, Test.Pass>(),
	check<AddOneToAnySingleInteger<-20>, never, Test.Pass>(),
]);
