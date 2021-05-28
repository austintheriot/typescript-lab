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

export type IsSpecificNumber<N extends number> = IsPlainNumber<N> extends true ? false : true;

checks([
	// should return false for generic number type
  check<IsSpecificNumber<number>, false, Test.Pass>(),

	// should return false if a number is any specific integer
  check<IsSpecificNumber<1000>, true, Test.Pass>(),
	check<IsSpecificNumber<5>, true, Test.Pass>(),
	check<IsSpecificNumber<1>, true, Test.Pass>(),
	check<IsSpecificNumber<0>, true, Test.Pass>(),
	check<IsSpecificNumber<-1>, true, Test.Pass>(),
  check<IsSpecificNumber<-100>, true, Test.Pass>(),
  
  // should return true if a number is any specific float
	check<IsSpecificNumber<1000.123>, true, Test.Pass>(),
	check<IsSpecificNumber<5.98>, true, Test.Pass>(),
	check<IsSpecificNumber<1.23>, true, Test.Pass>(),
	check<IsSpecificNumber<0.1>, true, Test.Pass>(),
	check<IsSpecificNumber<-1.123>, true, Test.Pass>(),
	check<IsSpecificNumber<-100.99999>, true, Test.Pass>(),
]);
