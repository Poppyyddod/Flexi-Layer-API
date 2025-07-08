import { IReturnToControllerCenter } from "@SRC/Auth/models/auth.global.model";
import { IAuthRefreshTokenData } from "@SRC/Auth/models/auth.refresh-token.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { Request } from "express";




/**
 * Validates the request body for the refresh-token operation.
 * Ensures that `db_type`, `store_code`, and `where.refresh_token` are provided.
 * Also removes the `set` field if it exists (not used in this context).
 *
 * @function ValidateRequest
 * @param {Request} req - The Express request object containing refresh token data.
 * @returns {boolean} Returns true if the request is valid; otherwise, false.
 */
const ValidateRequest = (req: Request): boolean => {
    const { db_type, store_code, where, set } = req.body as IMyRequestData;

    if (set)
        delete req.body['set'];

    if (!db_type || !store_code || !where) {
        console.error("[auth-refresh-token][ValidateRequest] Key is undefined!");
        return false;
    }

    const { refresh_token } = where as IAuthRefreshTokenData;

    if (!refresh_token) {
        console.error("[auth-refresh-token][ValidateRequest] AuthRefreshToken Key is incomplete!");
        return false;
    }

    return true;
};




/**
 * Controller for handling refresh token requests.
 * Validates the structure of the request and prepares the data
 * to be passed to the central authentication service.
 *
 * @function AuthRefreshTokenController
 * @param {any} helpers - A utility/helper object injected into the controller.
 * @returns {(req: Request) => Promise<IReturnToControllerCenter>} An async function that handles the request.
 */
export const AuthRefreshTokenController = (helpers: any) => async (req: Request): Promise<IReturnToControllerCenter> => {
    try {
        console.log('AuthRefreshTokenController :', req.body);

        const shouldContinue: boolean = ValidateRequest(req);
        if (!shouldContinue) throw { kind: 'incomplete_request' };

        console.log('AuthRefreshTokenController (validRequestFormat) : ', req);

        const dataToCenterController: IReturnToControllerCenter = {
            data: req.body,
            feature: 'refresh-token'
        };

        return dataToCenterController;
    } catch (error: any) {
        console.log('AuthRefreshTokenController (Error):', error);
        throw { ...error, feature: 'refresh-token' };
    }
};
