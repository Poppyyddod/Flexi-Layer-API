import { Request } from "express";
import { IReturnToControllerCenter } from "../models/auth.global.model";
import { AuthSignInController, AuthSignUpController, AuthSignOutController, AuthRefreshTokenController } from "./features";




/**
 * Defines the possible routes for the authentication controller.
 * These are the keys used to map to specific controller methods.
 * 
 * @typedef {('/auth/sign-up' | '/auth/sign-in' | '/auth/sign-out' | '/auth/refresh-token')} AuthControllerKeyRoutes
 */
export type AuthControllerKeyRoutes =
    '/auth/sign-up' |
    '/auth/sign-in' |
    '/auth/sign-out' |
    '/auth/refresh-token';





/**
 * A factory function that accepts helpers and returns a controller function
 * which handles the request and returns a response for the controller center.
 * 
 * @callback ControllerFactory
 * @param {any} helpers - Shared utilities or services needed by the controller.
 * @returns {(req: Request) => Promise<IReturnToControllerCenter>} - An async function that handles a request.
 */
type ControllerFactory = (helpers: any) => (req: Request) => Promise<IReturnToControllerCenter>;




/**
 * Maps each authentication route to its corresponding controller factory function.
 * 
 * @typedef {Object} AuthControllerMethodsModel
 * @property {ControllerFactory} '/auth/sign-in' - Handles user sign-in.
 * @property {ControllerFactory} '/auth/sign-up' - Handles user sign-up.
 * @property {ControllerFactory} '/auth/sign-out' - Handles user sign-out.
 * @property {ControllerFactory} '/auth/refresh-token' - Handles refresh token rotation.
 */
type AuthControllerMethodsModel = {
    [key in AuthControllerKeyRoutes]: ControllerFactory;
};



/**
 * Collection of controller factory functions mapped by their authentication routes.
 * These factories are responsible for returning the actual controller logic for each route.
 * 
 * @type {AuthControllerMethodsModel}
 */
export const authControllerMethods: AuthControllerMethodsModel = {
    '/auth/sign-in': (helpers: any) => {
        return AuthSignInController(helpers);
    },
    '/auth/sign-up': (helpers: any) => {
        return AuthSignUpController(helpers);
    },
    '/auth/sign-out': (helpers: any) => {
        return AuthSignOutController(helpers);
    },
    '/auth/refresh-token': (helpers: any) => {
        return AuthRefreshTokenController(helpers);
    },
};
