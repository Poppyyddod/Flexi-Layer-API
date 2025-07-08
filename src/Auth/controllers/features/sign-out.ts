import { IReturnToControllerCenter } from "@SRC/Auth/models/auth.global.model";
import { ISignOutData } from "@SRC/Auth/models/auth.sign-out.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { Request } from "express";





/**
 * Validates the request body for the sign-out operation.
 * It ensures that `db_type`, `store_code`, and `where.user_id` are provided.
 * Also removes the `set` field if present, as it should not be part of sign-out.
 *
 * @function ValidateRequest
 * @param {Request} req - The Express request object containing sign-out data.
 * @returns {boolean} Returns true if request is valid, otherwise false.
 */
const ValidateRequest = (req: Request): boolean => {
    const { db_type, store_code, where, set } = req.body as IMyRequestData;

    if (set)
        delete req.body['set'];

    if (!db_type || !store_code || !where) {
        console.error("[sign-out][ValidateRequest] Key is undefined!");
        return false;
    }

    const { user_id } = where as ISignOutData;

    if (!user_id) {
        console.error("[sign-out][ValidateRequest] SignOut Key is incomplete!");
        return false;
    }

    return true;
};







/**
 * Controller for handling user sign-out requests.
 * Validates the request body and prepares the data to be passed to the center service.
 *
 * @function AuthSignOutController
 * @param {any} helpers - An object containing utility or service dependencies.
 * @returns {(req: Request) => Promise<IReturnToControllerCenter>} An async function that handles the request.
 */
export const AuthSignOutController = (helpers: any) => async (req: Request): Promise<IReturnToControllerCenter> => {
    try {
        console.log('AuthSignOutController :', req.body);

        const shouldContinue: boolean = ValidateRequest(req);
        if (!shouldContinue) throw { kind: 'incomplete_request' };

        const dataToCenterController: IReturnToControllerCenter = {
            data: req.body,
            feature: 'sign-out'
        };

        return dataToCenterController;
    } catch (error: any) {
        console.log('AuthSignOutController (Error):', error);
        throw { ...error, feature: 'sign-out' };
    }
};
