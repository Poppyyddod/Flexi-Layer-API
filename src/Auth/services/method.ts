import { IReturnToCenterServiceData } from "../models/auth.global.model";
import { IServiceFeatureProps } from "../models/auth.sign-in.model";
import { AuthSignUpService, AuthSignInService, AuthSignOutService, AuthRefreshTokenService } from "./features";


/**
 * List of valid keys representing authentication service features.
 * These keys are used to dynamically route the request to the appropriate service.
 *
 * @typedef {'sign-up' | 'sign-in' | 'sign-out' | 'refresh-token'} AuthServiceKey
 */

export type AuthServiceKey = 'sign-up' | 'sign-in' | 'sign-out' | 'refresh-token';




/**
 * Maps each AuthServiceKey to a factory function that takes helpers
 * and returns an async service function, which handles the actual logic
 * of that particular authentication feature.
 *
 * @typedef {Object} AuthServiceMethodModel
 * @property {(helpers: any) => (params: IServiceFeatureProps) => Promise<IReturnToCenterServiceData>} - @features
 * - sign-up
 * - sign-in
 * - sign-out
 * - refresh-token
 */

type AuthServiceMethodModel = {
    [key in AuthServiceKey]: (helpers: any) => (params: IServiceFeatureProps) => Promise<IReturnToCenterServiceData>
}




/**
 * A map of all authentication service methods.
 * Each method is a factory function that takes helpers and returns a Promise-based service function.
 *
 * @constant
 * @type {AuthServiceMethodModel}
 */

export const authServiceMethod: AuthServiceMethodModel = {
    'sign-up': (helpers: any) => {
        return AuthSignUpService(helpers);
    },
    'sign-in': (helpers: any) => {
        return AuthSignInService(helpers);
    },
    'sign-out': (helpers: any) => {
        return AuthSignOutService(helpers);
    },
    'refresh-token': (helpers: any) => {
        return AuthRefreshTokenService(helpers);
    }
}