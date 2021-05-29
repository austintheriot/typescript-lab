import { Test } from 'ts-toolbelt';
import { IsNegative } from './isNegative';
const { checks, check } = Test;

export type IsPlainNumber<N extends number> = IsNegative<N> extends never ? true : false;

checks([
	// should return true for generic number type
  check<IsPlainNumber<number>, true, Test.Pass>(),
  
	// should return false if a number is any specific integer
	check<IsPlainNumber<1000>, false, Test.Pass>(),
	check<IsPlainNumber<5>, false, Test.Pass>(),
	check<IsPlainNumber<1>, false, Test.Pass>(),
	check<IsPlainNumber<0>, false, Test.Pass>(),
	check<IsPlainNumber<-1>, false, Test.Pass>(),
  check<IsPlainNumber<-100>, false, Test.Pass>(),
  
  // should return false if a number is any specific float
	check<IsPlainNumber<1000.123>, false, Test.Pass>(),
	check<IsPlainNumber<5.98>, false, Test.Pass>(),
	check<IsPlainNumber<1.23>, false, Test.Pass>(),
	check<IsPlainNumber<0.1>, false, Test.Pass>(),
	check<IsPlainNumber<-1.123>, false, Test.Pass>(),
	check<IsPlainNumber<-100.99999>, false, Test.Pass>(),
]);