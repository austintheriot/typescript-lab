
import { Test } from 'ts-toolbelt';
import { GetSearchParams } from './GetSearchParams';
import { ParseSearchParams } from './ParseSearchParams';
const { checks, check } = Test;

enum RouteId {
    USER,
    PAYMENT,
    PROFILE,
    PROFILE_SETTINGS,
    OTHER,
    PROFILE_SETTINGS_AUTHENTICATE
}

type Routes = {
    [RouteId.USER]: 'api/user';
    [RouteId.PAYMENT]: 'api/payment';
    [RouteId.PROFILE]: `api/profile/${string}`;
    [RouteId.PROFILE_SETTINGS]: `api/profile/${string}/settings`;
    [RouteId.PROFILE_SETTINGS_AUTHENTICATE]: `api/profile/${string}/settings?token=${string}`;
    [RouteId.OTHER]: never;
}

type Responses = {
    [RouteId.USER]: { token: string }
    [RouteId.PAYMENT]: { purchaseCompleted: boolean }
    [RouteId.PROFILE]: { admin: boolean }
    [RouteId.PROFILE_SETTINGS]: { themePreference: 0 | 1 | 2 }
    [RouteId.PROFILE_SETTINGS_AUTHENTICATE]: { success: boolean }
    [RouteId.OTHER]: { status: 404; message: 'Not Found'; }
}

type ParseRouteResponse<S extends string> = 
    S extends Routes[RouteId.USER]
    ? Responses[RouteId.USER]
    : S extends Routes[RouteId.PAYMENT]
    ? Responses[RouteId.PAYMENT]
    : S extends Routes[RouteId.PROFILE_SETTINGS]
    ? Responses[RouteId.PROFILE_SETTINGS]
    : S extends Routes[RouteId.PROFILE]
    ?  (
        ParseSearchParams<GetSearchParams<S>> extends { token: string }
        ? Responses[RouteId.PROFILE_SETTINGS_AUTHENTICATE]
        : Responses[RouteId.USER]
    ) 
    : Responses[RouteId.OTHER]


checks([
    check<ParseRouteResponse<'api/user'>, {
        token: string;
    }, Test.Pass>(),

    check<ParseRouteResponse<'api/payment'>, {
        purchaseCompleted: boolean;
    }, Test.Pass>(),

    check<ParseRouteResponse<'api/profile/123456789'>, {
        token: string;
    }, Test.Pass>(),

    check<ParseRouteResponse<'api/profile/?token=abcdefgh'>, {
        success: boolean;
    }, Test.Pass>(),

    check<ParseRouteResponse<'api/profile/this-is-some-dynamic-portion-of-the-route/settings'>, {
        themePreference: 0 | 1 | 2;
    }, Test.Pass>(),

    check<ParseRouteResponse<'not/a/route'>, {
        status: 404;
        message: 'Not Found';
    }, Test.Pass>(),
]);
