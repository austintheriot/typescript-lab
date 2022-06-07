
import { Test } from 'ts-toolbelt';
import { DeleteSearchParams } from './DeleteSearchParams';
import { GetSearchParams } from './GetSearchParams';
import { ParseSearchParams, SearchParamsObject } from './ParseSearchParams';
const { checks, check } = Test;

/** This is the format that all routes in the array should mimic */
export interface RouteAndResponse {
    route: unknown;
    response: unknown;
    params?: SearchParamsObject;
}

/** Short-circuits if the rest of the array does not match the `RouteAndResponse` type */
type TestNextRoute<
    // String - route string to match against
    S extends string,
    // Rest - array of routes and responses
    Rest,
    // Error - which type to return in the event that parsing fails
    E = never,
    // Print Debug - if the function should print the debug information instead of the result
    P extends boolean = false,
    // Debug Results - this a collection of data that the generic function accuumulates for debugging
    D extends any[] = [],
    > = Rest extends RouteAndResponse[]
    ? MatchRouteToResponse<S, Rest, E, P, D>
    : E

/** Parses a string literal to determine if any of the given routes & responses match the string */
export type MatchRouteToResponse<
    // String - route string to match against
    S extends string,
    // Route - array of routes and responses
    R extends RouteAndResponse[],
    // Error - which type to return in the event that parsing fails
    E = never,
    // Print Debug - if the function should print the debug information instead of the result
    P extends boolean = false,
    // Debug
    D extends any[] = [],
    > = R extends [infer Head, ...infer Rest]
    ? (
        Head extends { route: infer Route, response: infer Response, params?: infer Params }
        ? (
            DeleteSearchParams<S> extends Route ? (
                Params extends undefined

                // route matches and no params, this route matches
                ? Response

                // route matches and there are params, see if they match
                : (
                    ParseSearchParams<GetSearchParams<S>> extends Params

                    // route and params match, return the response
                    ? (
                        P extends true

                        // return debug information
                        ? [...D, {
                            sRaw: S,
                            sWithoutParams: DeleteSearchParams<S>,
                            parsedParams: ParseSearchParams<GetSearchParams<S>>,
                            head: Head,
                        }]

                        // return actual response
                        : Response
                    )

                    // param types didn't match
                    : TestNextRoute<S, Rest, E, P, [...D, 'params do not match']>
                )
            )
            // route does not match
            : TestNextRoute<S, Rest, E, P, [...D, 'route does not match']>
        )

        // element in the array does not match the expected structure, move on
        : TestNextRoute<S, Rest, E, P, [...D, 'element in the array does not match the expected structure']>
    )

    : (
        // no more elements and nothing to match, give up
        P extends true

        // return debug information
        ? D

        // return error
        : E
    );


// Tests -------------------------------------------------------------------------------------

/** An array of routes to match against, with their search params and responses */
type RoutesAndResponses = [{
    route: 'api/user',
    response: { token: string },
}, {
    route: 'api/payment',
    response: { purchaseCompleted: boolean }
}, {
    route: `api/profile/${string}/settings`,
    response: { success: boolean },
    params: { token: string }
}, {
    route: `api/profile/${string}/settings`,
    response: { themePreference: 0 | 1 | 2 },
}, {
    route: `api/profile/${string}`,
    response: { admin: boolean },
}, {
    route: 'api/profile',
    response: { users: number },
}];

checks([
    check<MatchRouteToResponse<'api/user', []>, never, Test.Pass>(),

    check<MatchRouteToResponse<'api/user', RoutesAndResponses>, {
        token: string;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'api/payment', RoutesAndResponses>, {
        purchaseCompleted: boolean;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'api/profile', RoutesAndResponses>, {
        users: number;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'api/profile/cory-pickrel', RoutesAndResponses>, {
        admin: boolean;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'api/profile/abc/settings?token=abcdefgh', RoutesAndResponses>, {
        success: boolean;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'api/profile/akeem-mkclennon/settings', RoutesAndResponses>, {
        themePreference: 0 | 1 | 2;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'not/a/route', RoutesAndResponses>, never, Test.Pass>(),

    // Edge Cases ----------------------------------------------------------

    // wide string type
    check<MatchRouteToResponse<string, RoutesAndResponses>, never, Test.Pass>(),

    // empty array
    check<MatchRouteToResponse<'example', []>, never, Test.Pass>(),
]);
