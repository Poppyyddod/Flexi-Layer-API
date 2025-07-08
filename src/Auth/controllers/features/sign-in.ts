import { IReturnToControllerCenter } from "@SRC/Auth/models/auth.global.model";
import { ISignInData } from "@SRC/Auth/models/auth.sign-in.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { Request } from "express";

/**
 * Validates the request body for the sign-in operation.
 * Ensures that `db_type`, `store_code`, and `where` exist.
 * Then checks that either `user_email` or `user_name` is present,
 * along with `user_password`. Also removes `set` if it's present.
 *
 * @function ValidateRequest
 * @param {Request} req - The Express request object containing sign-in data.
 * @returns {boolean} Returns true if the request is valid; otherwise, false.
 */
const ValidateRequest = (req: Request): boolean => {
    const { db_type, store_code, where, set } = req.body as IMyRequestData;

    if (set)
        delete req.body['set'];

    if (!db_type || !store_code || !where) {
        console.error("[sign-up][ValidateRequest] Key is undefined!");
        return false;
    }

    const { user_email, user_name, user_password } = where as ISignInData;

    if ((!user_email && !user_name) || !user_password) {
        console.error("[sign-up][ValidateRequest] SignIn Key is incomplete!");
        return false;
    }

    return true;
};





/**
 * Controller for handling user sign-in requests.
 * Validates request structure and fields, and prepares the data
 * for the central authentication service.
 *
 * @function AuthSignInController
 * @param {any} helpers - A utility/helper object injected into the controller.
 * @returns {(req: Request) => Promise<IReturnToControllerCenter>} An async function that processes the request.
 */
export const AuthSignInController = (helpers: any) => async (req: Request): Promise<IReturnToControllerCenter> => {
    try {
        console.log('AuthSignInController :', req.body);

        const shouldContinue = ValidateRequest(req);
        if (!shouldContinue) throw { kind: 'incomplete_request' };

        console.log('AuthSignInController (validRequestFormat) : ', req.body);

        const dataToCenterController: IReturnToControllerCenter = {
            data: req.body,
            feature: 'sign-in'
        };

        return dataToCenterController;
    } catch (error: any) {
        console.log('AuthSignInController (Error):', error);
        throw { ...error, feature: 'sign-in' };
    }
};
