import { Test } from "ts-toolbelt"
const { checks, check } = Test

/**
 * Creates one of two possible types:
 * 1) a tuple containing all the indexes of an array up to a given length
 * 2) a union of all indexes of an array up to a given length.
 *
 * Example:
 * MakeIndexes<3, 'union'> = 0 | 1 | 2;
 * MakeIndexes<5, 'tuple'> = [0, 1, 2, 3, 4]
 *
 * Edge Cases:
 * MakeIndexes<0, 'union'> = never;
 * MakeIndexes<0, 'tuple'> = []
 *
 * This type is useful for when limiting the types of numbers
 * that can be accepted. i.e. when if you have an array of fixed length
 * and you only want to accept numbers that you know can access that array.
 */
export type MakeIndexes<
  Length extends number = 1, // the length of the array
  ReturnType extends 'tuple' | 'union' = 'union', // type that this generic should return
  _StorageTuple extends number[] = [], // stores the tuple when making the type recursively
  _StorageUnion extends number = never, // stores the union when making the type recursively
  > =  _StorageTuple['length'] extends Length
  // the tuple/array is the proper length: return the intended type
  ? (ReturnType extends 'tuple' ? _StorageTuple : _StorageUnion)
  // the tuple/array is not yet filled, call the type recursively
  : MakeIndexes<
    Length,
    ReturnType,
    [..._StorageTuple, _StorageTuple['length']],
    _StorageUnion | _StorageTuple['length']
  >

checks([
  // should form correct tuples
  check<MakeIndexes<0, 'tuple'>, [], Test.Pass>(),
  check<MakeIndexes<3, 'tuple'>, [0, 1, 2], Test.Pass>(),
  check<MakeIndexes<5, 'tuple'>, [0, 1, 2, 3, 4], Test.Pass>(),

  // should form correct unions
  check<MakeIndexes<0, 'union'>, never, Test.Pass>(),
  check<MakeIndexes<1, 'union'>, 0, Test.Pass>(),
  check<MakeIndexes<5, 'union'>, 0 | 1 | 2 | 3 | 4, Test.Pass>(),

  // should produce unions by default
  check<MakeIndexes<0>, never, Test.Pass>(),
  check<MakeIndexes<1>, 0, Test.Pass>(),
  check<MakeIndexes<5>, 0 | 1 | 2 | 3 | 4, Test.Pass>(),

  // union should not accept plain number type
  check<MakeIndexes<number>, never, Test.Pass>(),
  // tuple should produce an empty array on plain number type
  check<MakeIndexes<number, 'tuple'>, [], Test.Pass>(),
])