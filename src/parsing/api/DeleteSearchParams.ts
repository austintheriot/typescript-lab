
import { Test } from 'ts-toolbelt';
const { checks, check } = Test;

/** Extracts the everything BEFORE the search params in a URL  */
export type DeleteSearchParams<S> = S extends `${infer Route}?${infer SearchParams}` ? Route : S;

checks([
    // empty search params
    check<DeleteSearchParams<'api/user?'>, 'api/user', Test.Pass>(),

    // one search param
    check<DeleteSearchParams<'api/user?this-is=an-example'>, 'api/user', Test.Pass>(),

    // if ONLY search params, return empty string
    check<DeleteSearchParams<'?this-is=an-example'>, '', Test.Pass>(),

    // Edge Cases --------------------------------------------------------------------

    // wide string type
    check<DeleteSearchParams<string>, string, Test.Pass>(),
]);
