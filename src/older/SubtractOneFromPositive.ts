import { Test } from "ts-toolbelt";
const { checks, check } = Test;
import { IntegerToTuple } from "./IntegerToTuple";
import { IsZeroOrPositiveInteger } from "./IsZeroOrPositiveInteger";
import { ShiftTuple } from "./ShiftTuple";

/**
 * Given a positive integer, subtracts one.
 */
export type SubtractOneFromPositive<N extends number> =
  N extends 0
  ? never
  : IsZeroOrPositiveInteger<N> extends true
    ? ShiftTuple<IntegerToTuple<N>> extends unknown[]
      ? ShiftTuple<IntegerToTuple<N>>["length"]
      : never
    : never;

checks([
  // subtracts 1 from a positive integer
  check<SubtractOneFromPositive<1>, 0, Test.Pass>(),
  check<SubtractOneFromPositive<2>, 1, Test.Pass>(),
  check<SubtractOneFromPositive<10>, 9, Test.Pass>(),
  check<SubtractOneFromPositive<20>, 19, Test.Pass>(),
  check<SubtractOneFromPositive<30>, 29, Test.Pass>(),

  // should reject plain number type
  check<SubtractOneFromPositive<number>, never, Test.Pass>(),
  
  // should reject 0
  check<SubtractOneFromPositive<0>, never, Test.Pass>(),

  // should reject negative numbers
  check<SubtractOneFromPositive<-1>, never, Test.Pass>(),
  check<SubtractOneFromPositive<-50>, never, Test.Pass>(),
  check<SubtractOneFromPositive<-100>, never, Test.Pass>(),
  check<SubtractOneFromPositive<-1000>, never, Test.Pass>(),
]);
