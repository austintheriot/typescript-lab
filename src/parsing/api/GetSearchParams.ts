
import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

/** Extracts the seach params portion from the URL (i.e. everything after the first `?`) */
export type GetSearchParams<S extends string> = S extends `${infer Route}?${infer SearchParams}` ? SearchParams : S;

checks([
    // empty search params
    check<GetSearchParams<'api/user?'>, '', Test.Pass>(),

    // one search param
    check<GetSearchParams<'api/user?this-is=an-example'>, 'this-is=an-example', Test.Pass>(),

    // if no search params, return original string
    check<GetSearchParams<'api/user'>, 'api/user', Test.Pass>(),

    // wide string type
    check<GetSearchParams<string>, string, Test.Pass>(),
]);
