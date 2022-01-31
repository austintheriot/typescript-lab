import { ShiftTuple } from '../older/ShiftTuple';
import { Test } from "ts-toolbelt";
const { checks, check } = Test;


/** Convert readonly type to plain type */
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

////////////////////////////////////////////////////////////////////////////////////////////////

interface ConvertPrimitiveTest1 {
  Number: number,
  String: string,
  Null: null,
}

interface ConvertPrimitiveTest2 {
  A: 1,
  B: 2,
  C: 3,
}

/** Convert raw string values into types */
type ConvertPrimitive<PrimitiveType, Map extends unknown> = PrimitiveType extends keyof Map
  ? Map[PrimitiveType]
  : PrimitiveType;

checks([
  check<ConvertPrimitive<'Number', ConvertPrimitiveTest1>, number, Test.Pass>(),
  check<ConvertPrimitive<'String', ConvertPrimitiveTest1>, string, Test.Pass>(),
  check<ConvertPrimitive<'Null', ConvertPrimitiveTest1>, null, Test.Pass>(),

  check<ConvertPrimitive<'A', ConvertPrimitiveTest2>, 1, Test.Pass>(),
  check<ConvertPrimitive<'B', ConvertPrimitiveTest2>, 2, Test.Pass>(),
  check<ConvertPrimitive<'C', ConvertPrimitiveTest2>, 3, Test.Pass>(),
]);

////////////////////////////////////////////////////////////////////////////////////////////////

/** Iterate through every element in the tuple, converting it as it's own schema object */
export type ConvertTuple<
  A extends unknown[],
  SchemaMap extends unknown,
  StorageTuple extends unknown[] = []
  > = A['length'] extends 0
  ? StorageTuple : ConvertTuple<ShiftTuple<A>, SchemaMap, [...StorageTuple, ParseSchema<A[0], SchemaMap>]>;


////////////////////////////////////////////////////////////////////////////////////////////////
    
/** Recursive driver function */
type ParseSchema<SchemaObject, SchemaMap extends unknown> = {
  [Key in keyof SchemaObject]:

  // convert nested schema object
  SchemaObject[Key] extends Record<string | number | symbol, unknown>
  ? ParseSchema<SchemaObject[Key], SchemaMap>

  // convert readonly array to writable array
  : SchemaObject[Key] extends readonly unknown[]
  ? ParseSchema<DeepWriteable<SchemaObject[Key]>, SchemaMap>

  // convert array of primitives to array of types
  : SchemaObject[Key] extends unknown[]
  ? ConvertTuple<SchemaObject[Key], SchemaMap>

  // convert primitive type to it's TypeScript equivalent
  : ConvertPrimitive<SchemaObject[Key], SchemaMap>
}

const Schema = {
  field1: 'Number',
  field2: 'String',
  innerField: {
    field3: 'Null',
    '0': "String",
    1: 'Number',
    thisIsAnArray: ['Number', 'String', 'Null'],
    notARealSchemaType: 'Example',
  }
} as const;

interface SchemaMap {
  'Number': number,
  'String': string,
  'Null': null,
}

type Input = typeof Schema;
type Output = ParseSchema<Input, SchemaMap>;

checks([
  // should parse top-level primitives correctly
	check<Output['field1'], number, Test.Pass>(),
  check<Output['field2'], string, Test.Pass>(),
  
  // should convert nested schemas recursively
	check<Output['innerField']['field3'], null, Test.Pass>(),
	check<Output['innerField']['0'], string, Test.Pass>(),
  check<Output['innerField']['1'], number, Test.Pass>(),
  
  // should convert tuples as their own schemas
	check<Output['innerField']['thisIsAnArray'][0], number, Test.Pass>(),
	check<Output['innerField']['thisIsAnArray'][1], string, Test.Pass>(),
  check<Output['innerField']['thisIsAnArray'][2], null, Test.Pass>(),
  
  // should output illegitimate schema types as the raw type
	check<Output['innerField']['notARealSchemaType'], 'Example', Test.Pass>(),
]);
