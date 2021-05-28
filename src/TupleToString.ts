import { Test } from "ts-toolbelt"
import { MakeIndexes } from "./MakeIndexes"
import { RemoveHead } from "./RemoveHead"

const { checks, check } = Test

/**
 * Removes the first element from a tuple.
 */
export type TupleToString<
  Tuple extends string[],
  _StorageString extends string = '',
  > = Tuple extends string[] ? (Tuple['length'] extends 0
    ? _StorageString : TupleToString<
      RemoveHead<Tuple>,
      `${_StorageString}${Tuple[0]}`
    >) : never;

checks([
  // should concatenate a tuple of strings into a single string
  check<TupleToString<['hello ', 'world']>, 'hello world', Test.Pass>(),
  check<TupleToString<[]>, '', Test.Pass>(),
])
