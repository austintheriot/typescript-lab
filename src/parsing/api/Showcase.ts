
import { Test } from 'ts-toolbelt';
import { MatchRouteToResponse } from './MatchRouteToResponse';
const { checks, check } = Test;

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

    check<MatchRouteToResponse<'api/profile/firstname-lastname', RoutesAndResponses>, {
        admin: boolean;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'api/profile/abc/settings?token=abcdefgh', RoutesAndResponses>, {
        success: boolean;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'api/profile/austin-theriot/settings', RoutesAndResponses>, {
        themePreference: 0 | 1 | 2;
    }, Test.Pass>(),

    check<MatchRouteToResponse<'not/a/route', RoutesAndResponses>, never, Test.Pass>(),

    // Edge Cases ----------------------------------------------------------

    check<MatchRouteToResponse<string, RoutesAndResponses>, never, Test.Pass>(),
]);
