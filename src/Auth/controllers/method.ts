import { AuthSignInController, AuthSignUpController } from "./features";

export type AuthControllerKeyRoutes = '/auth/sign-up' | '/auth/sign-in' | '/auth/sign-out';

type AuthControllerMethodsModel = {
    [key in AuthControllerKeyRoutes]: any;
}

export const authControllerMethods: AuthControllerMethodsModel = {
    '/auth/sign-in': (helpers: any) => {
        return AuthSignInController(helpers);
    },

    '/auth/sign-up': (helpers: any) => {
        return AuthSignUpController(helpers);
    },

    '/auth/sign-out': (helpers: any) => {
        return AuthSignUpController(helpers);
    },
}