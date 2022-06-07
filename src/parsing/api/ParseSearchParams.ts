/* eslint-disable @typescript-eslint/ban-types */
import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

export type QueryParamObject = Record<string, string>;

/** Merges a key-value string pair into an existing interface */
export type MergeIntoObject<
    Property extends string,
    Value extends string,
    Object extends QueryParamObject
    > = {
        [Key in keyof Object | Property]: Key extends keyof Object
        // if key is repeated, merge it
        ? (Key extends Property ? Object[Key] | Value : Object[Key])
        : Value;
    };

/** Converts the search params portion of a URL into an interface type */
export type ParseSearchParams<
    // assumes that this string ONLY contains the search params portion of the URL
    // i.e. no path or `?` is present--only the key-value pairs
    S extends string,

    // stores the intermediate search params in an interface
    _Storage extends Record<any, any> = {},
    > =
    // there is a key-value pair with more after
    S extends `${infer Property}=${infer Value}&${infer Rest}`
    ? ParseSearchParams<Rest, MergeIntoObject<Property, Value, _Storage>>

    // only one more key-value pair left
    : S extends `${infer Property}=${infer Value}`
    ? MergeIntoObject<Property, Value, _Storage>

    // nothing matched, return what we have
    : _Storage;

checks([
    // empty search params
    check<ParseSearchParams<''>, {}, Test.Pass>(),

    // one search param
    check<ParseSearchParams<'this-is=an-example'>, {
        "this-is": "an-example";
    }, Test.Pass>(),

    // two search params
    check<ParseSearchParams<'a=1&b=2'>, {
        a: "1";
        b: "2";
    }, Test.Pass>(),

    // merge identical search params together
    check<ParseSearchParams<'a=1&a=2&a=hello'>, {
        a: "1" | "2" | 'hello';
    }, Test.Pass>(),

    // combinations
    check<ParseSearchParams<'a=1&a=2&getUser=false'>, {
        a: "1" | "2";
        getUser: 'false';
    }, Test.Pass>(),

    // if no search params, return empty object
    check<ParseSearchParams<'api/user'>, {}, Test.Pass>(),
]);
