
import { Test } from 'ts-toolbelt';
import { GetSearchParams } from './GetSearchParams';
import { ParseSearchParams } from './ParseSearchParams';
const { checks, check } = Test;

/** A unique identifier for every route */
enum RouteId {
    USER,
    PAYMENT,
    PROFILE,
    PROFILE_DYNAMIC,
    PROFILE_DYNAMIC_SETTINGS,
    PROFILE_DYNAMIC_SETTINGS_AUTH,
    OTHER,
}

/**
 * A map of each Route's unique ID to the type-encoding of its URL,
 * including any possilble search parameters that might affect the shape of the response.
 */
type Routes = {
    [RouteId.USER]: 'api/user';
    [RouteId.PAYMENT]: 'api/payment';
    [RouteId.PROFILE]: `api/profile`;
    [RouteId.PROFILE_DYNAMIC]: `api/profile/${string}`;
    [RouteId.PROFILE_DYNAMIC_SETTINGS]: `api/profile/${string}/settings`;
    [RouteId.PROFILE_DYNAMIC_SETTINGS_AUTH]: `api/profile/${string}/settings?token=${string}`;
    [RouteId.OTHER]: never;
}

/**
 * A map of each Route's unique ID to the type-encoding of its RESPONSE type.
 */
type Responses = {
    [RouteId.USER]: { token: string }
    [RouteId.PAYMENT]: { purchaseCompleted: boolean }
    [RouteId.PROFILE]: { users: number }
    [RouteId.PROFILE_DYNAMIC]: { admin: boolean }
    [RouteId.PROFILE_DYNAMIC_SETTINGS]: { themePreference: 0 | 1 | 2 }
    [RouteId.PROFILE_DYNAMIC_SETTINGS_AUTH]: { success: boolean }
    [RouteId.OTHER]: { status: 404; message: 'Not Found'; }
}

/** Parses a string literal to determine the appropriate response type */
type ParseRouteForResponse<S extends string> = 
    S extends Routes[RouteId.USER]
    ? Responses[RouteId.USER]
    : S extends Routes[RouteId.PAYMENT]
    ? Responses[RouteId.PAYMENT]
    : S extends Routes[RouteId.PROFILE_DYNAMIC_SETTINGS]
    ? Responses[RouteId.PROFILE_DYNAMIC_SETTINGS]
    : S extends Routes[RouteId.PROFILE]
    ? Responses[RouteId.PROFILE]
    : S extends Routes[RouteId.PROFILE_DYNAMIC]
    ?  (
        ParseSearchParams<GetSearchParams<S>> extends { token: string }
        ? Responses[RouteId.PROFILE_DYNAMIC_SETTINGS_AUTH]
        : Responses[RouteId.PROFILE_DYNAMIC]
    ) 
    : Responses[RouteId.OTHER]


checks([
    check<ParseRouteForResponse<'api/user'>, {
        token: string;
    }, Test.Pass>(),

    check<ParseRouteForResponse<'api/payment'>, {
        purchaseCompleted: boolean;
    }, Test.Pass>(),

    check<ParseRouteForResponse<'api/profile'>, {
        users: number;
    }, Test.Pass>(),

    check<ParseRouteForResponse<'api/profile/cory-pickrel'>, {
        admin: boolean;
    }, Test.Pass>(),

    check<ParseRouteForResponse<'api/profile/austin-theriot/settings/?token=abcdefgh'>, {
        success: boolean;
    }, Test.Pass>(),

    check<ParseRouteForResponse<'api/profile/akeem-mkclennon/settings'>, {
        themePreference: 0 | 1 | 2;
    }, Test.Pass>(),

    check<ParseRouteForResponse<'not/a/route'>, {
        status: 404;
        message: 'Not Found';
    }, Test.Pass>(),

    // Edge Cases ----------------------------------------------------------
    
    check<ParseRouteForResponse<string>, {
        status: 404;
        message: 'Not Found';
    }, Test.Pass>(),
]);
