import { ShiftTuple } from './ShiftTuple';
import { Test } from "ts-toolbelt";
const { checks, check } = Test;

type SchemaNumber = 'Number';
type SchemaString = 'String';
type SchemaNull = 'Null'

/** Convert raw string values into types */
type ConvertPrimitive<PrimitiveType> = PrimitiveType extends SchemaNumber
  ? number
  : PrimitiveType extends SchemaString
  ? string
  : PrimitiveType extends SchemaNull
  ? null
  : PrimitiveType;

/** Convert readonly type to plain type */
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

/** Iterate through every element in the tuple, converting it as it's own schema object */
export type ConvertTuple<A extends unknown[], StorageTuple extends unknown[] = []> = A['length'] extends 0
  ? StorageTuple : ConvertTuple<ShiftTuple<A>, [...StorageTuple, ParseSchema<A[0]>]>;
    
/** Recursive driver function */
type ParseSchema<SchemaObject> = {
  [Key in keyof SchemaObject]:
  // convert nested schema object
  SchemaObject[Key] extends Record<string | number | symbol, unknown>
  ? ParseSchema<SchemaObject[Key]>

  // convert readonly array to writable array
  : SchemaObject[Key] extends readonly unknown[]
  ? ParseSchema<DeepWriteable<SchemaObject[Key]>>

  // convert array of primitives to array of types
  : SchemaObject[Key] extends unknown[]
  ? ConvertTuple<SchemaObject[Key]>

  // convert primitive type to it's TypeScript equivalent
  : ConvertPrimitive<SchemaObject[Key]>
}

const Schema = {
  field1: 'Number',
  field2: 'String',
  innerField: {
    field3: 'Null',
    '0': "String",
    thisIsAnArray: ['Number', 'String', 'Null'],
    notARealSchemaType: 'Example',
  }
} as const;
type Input = typeof Schema;

type Output = ParseSchema<Input>;

checks([
	// given a number, should make a tuple of that length
	check<Output['field1'], number, Test.Pass>(),
	check<Output['field2'], string, Test.Pass>(),
	check<Output['innerField']['field3'], null, Test.Pass>(),
	check<Output['innerField']['0'], string, Test.Pass>(),
	check<Output['innerField']['thisIsAnArray'][0], number, Test.Pass>(),
	check<Output['innerField']['thisIsAnArray'][1], string, Test.Pass>(),
	check<Output['innerField']['thisIsAnArray'][2], null, Test.Pass>(),
	check<Output['innerField']['notARealSchemaType'], 'Example', Test.Pass>(),
]);
