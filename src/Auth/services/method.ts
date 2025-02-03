import { AuthSignInService } from "./features";
import { AuthSignUpService } from "./features/sign-up";


export type AuthServiceKey = 'sign-up' | 'sign-in' | 'sign-out';

type AuthServiceMethodModel = {
    [key in AuthServiceKey]: any
}

export const authServiceMethod: AuthServiceMethodModel = {
    'sign-up': (helpers: any) => {
        return AuthSignUpService(helpers);
    },
    'sign-in': (helpers: any) => {
        return AuthSignInService(helpers);
    },
    'sign-out': (helpers: any) => {
        return;
    }
}