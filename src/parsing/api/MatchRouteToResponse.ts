
import { Test } from 'ts-toolbelt';
import { DeleteSearchParams } from './DeleteSearchParams';
import { GetSearchParams } from './GetSearchParams';
import { ParseSearchParams, SearchParamsObject } from './ParseSearchParams';
const { checks, check } = Test;

export type HttpRequestMethods = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATH';

/** This is the format that all routes in the array should mimic */
export interface RouteAndResponse {
    route: unknown;
    response: unknown;
    params?: SearchParamsObject;
    method?: HttpRequestMethods;
}

/** Short-circuits if the rest of the array does not match the `RouteAndResponse` type */
type TestNextRoute<
    RestOfTestRoutes,
    InputString extends string,
    InputMethod extends HttpRequestMethods,
    InputError = never,
    ShouldPrintDebug extends boolean = false,
    DebugData extends any[] = [],
> = RestOfTestRoutes extends RouteAndResponse[]
    ? MatchRouteToResponse<InputString, RestOfTestRoutes, InputMethod, InputError, ShouldPrintDebug, DebugData>
    : InputError

export type DEFAULT_HTTP_METHOD = 'GET';


export type CheckMethod<Args extends {
    restOfTestRoutes: unknown,

    routeResponse: unknown,
    routeMethod: unknown,

    inputString: string,
    inputMethod: HttpRequestMethods,
    inputError: unknown,
    shouldPrintDebug: boolean,
    debugData: any[],
}> = Args['routeMethod'] extends undefined

    // this route has no defined method, so assume that it is GET
    ? (
        Args['inputMethod'] extends DEFAULT_HTTP_METHOD

        // route, params, and method match
        ? Args['routeResponse']

        // input Method does match the route's inferred 'GET' method
        : TestNextRoute<Args['restOfTestRoutes'], Args['inputString'], Args['inputMethod'], Args['inputError'], Args['shouldPrintDebug'], [...Args['debugData'], 'method does not match default GET method']>
    )

    // this route DOES have a defined method: does it match?
    : (
        Args['inputMethod'] extends Args['routeMethod']

        // route, params, and method match, return response
        ? Args['routeResponse']

        // method doesn't match
        : TestNextRoute<Args['restOfTestRoutes'], Args['inputString'], Args['inputMethod'], Args['inputError'], Args['shouldPrintDebug'], [...Args['debugData'], 'method does not match route\'s method']>
    )


export type CheckParams<Args extends {
    restOfTestRoutes: unknown,

    routeResponse: unknown,
    routeMethod: unknown,
    routeParams: unknown,

    inputString: string,
    inputMethod: HttpRequestMethods,
    inputError: unknown,

    shouldPrintDebug: boolean,
    debugData: any[],
}> = Args['routeParams'] extends undefined
    // route matches and no param constraints on Route, this route matches
    ? Args['routeResponse']

    // route matches and there are params, see if they match
    : ParseSearchParams<GetSearchParams<Args['inputString']>> extends Args['routeParams']

    // check method
    ? CheckMethod<{
        restOfTestRoutes: Args['restOfTestRoutes'],
        routeResponse: Args['routeResponse'],
        routeMethod: Args['routeMethod'],
        inputString: Args['inputString'],
        inputMethod: Args['inputMethod'],
        inputError: Args['inputError'],
        shouldPrintDebug: Args['shouldPrintDebug'],
        debugData: Args['debugData']
    }>

    // param types didn't match
    : TestNextRoute<Args['restOfTestRoutes'], Args['inputString'], Args['inputMethod'], Args['inputError'], Args['shouldPrintDebug'], [...Args['debugData'], 'params do not match']>;

/** Parses a string literal to determine if any of the given routes & responses match the string */
export type MatchRouteToResponse<
    // String - route string to match against
    InputString extends string,
    // Route - array of routes and responses
    InputRoutes extends RouteAndResponse[],
    // Method - which method is being used to request a resource
    InputMethod extends HttpRequestMethods = DEFAULT_HTTP_METHOD,
    // Error - which type to return in the event that parsing fails
    InputError = never,
    // Print Debug - if the function should print the debug information instead of the result
    ShouldPrintDebug extends boolean = false,
    // Debug
    DebugData extends any[] = [],
> = InputRoutes extends [infer TestRoute, ...infer RestOfTestRoutes]
    ? (
        TestRoute extends { route: infer RouteRoute, response: infer RouteResponse, params?: infer RouteParams, method?: infer RouteMethod }
        ? (
            DeleteSearchParams<InputString> extends RouteRoute ? (
                CheckParams<{
                    restOfTestRoutes: RestOfTestRoutes,
                    routeResponse: RouteResponse,
                    routeMethod: RouteMethod,
                    routeParams: RouteParams,
                    inputString: InputString,
                    inputMethod: InputMethod,
                    inputError: InputError,
                    shouldPrintDebug: ShouldPrintDebug,
                    debugData: DebugData
                }>
            )
            // route does not match
            : TestNextRoute<RestOfTestRoutes, InputString, InputMethod, InputError, ShouldPrintDebug, [...DebugData, 'route does not match']>
        )

        // element in the array does not match the expected structure, move on
        : TestNextRoute<RestOfTestRoutes, InputString, InputMethod, InputError, ShouldPrintDebug, [...DebugData, 'element in the array does not match the expected structure']>
    )

    : InputError;


// Tests -------------------------------------------------------------------------------------

/** An array of routes to match against, with their search params and responses */
type RoutesAndResponses = [{
    route: 'api/user',
    response: { token: string },
}, {
    route: 'api/user',
    response: { created: boolean },
    method: 'POST'
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
    check<MatchRouteToResponse<'api/user', RoutesAndResponses>, {
        token: string;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'api/user', RoutesAndResponses, 'POST'>, {
        created: boolean;
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
    check<MatchRouteToResponse<'api/user', []>, never, Test.Pass>(),

    check<MatchRouteToResponse<'api/user', [], 'POST'>, never, Test.Pass>(),
]);
