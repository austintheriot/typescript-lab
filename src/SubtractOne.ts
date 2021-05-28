import { Test } from "ts-toolbelt";
const { checks, check } = Test;
import { IntegerToTuple } from "./IntegerToTuple";
import { IsZeroOrPositiveInteger } from "./IsZeroOrPositiveInteger";
import { Shift } from "./Shift";

export type SubtractOne<N extends number> =
  IsZeroOrPositiveInteger<N> extends true
    ? Shift<IntegerToTuple<N>> extends any[]
      ? Shift<IntegerToTuple<N>>["length"]
      : never
    : never;

checks([
  // subtracts 1 from a positive integer
  check<SubtractOne<1>, 0, Test.Pass>(),
  check<SubtractOne<2>, 1, Test.Pass>(),
  check<SubtractOne<10>, 9, Test.Pass>(),
  check<SubtractOne<20>, 19, Test.Pass>(),
  check<SubtractOne<30>, 29, Test.Pass>(),

  // should reject plain number type
  check<SubtractOne<number>, never, Test.Pass>(),

  // should reject negative numbers
  check<SubtractOne<-1>, never, Test.Pass>(),
  check<SubtractOne<-50>, never, Test.Pass>(),
  check<SubtractOne<-100>, never, Test.Pass>(),
  check<SubtractOne<-1000>, never, Test.Pass>(),
]);
