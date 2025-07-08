import { IReturnToControllerCenter } from "@SRC/Auth/models/auth.global.model";
import { ISignUpData } from "@SRC/Auth/models/auth.sign-up.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { Request } from "express";
import sanitizeHtml from 'sanitize-html';



/**
 * Checks and prevents potential XSS (Cross-site Scripting) by removing all HTML tags from input.
 * If the cleaned input does not match the original, it throws an error.
 *
 * @function CheckerXSS
 * @param {string} text - The input string to be validated for XSS.
 * @throws {Object} Throws an error object if input contains HTML tags.
 */
const CheckerXSS = (text: string): void => {
    const cleanedName: string = sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {}
    });

    if (cleanedName !== text) {
        throw { kind: 'username_contains_html' };
    }
};








/**
 * Validates the structure and completeness of the request body for sign-up.
 * It ensures that required fields like `db_type`, `store_code`, and `set` are present,
 * and that `user_email`, `user_name`, and `user_password` exist in the `set` object.
 * 
 * Also removes `where` field if present.
 *
 * @function ValidateRequest
 * @param {Request} req - The Express request object containing the sign-up data.
 * @returns {boolean} Returns `true` if the request is valid, otherwise `false`.
 */
const ValidateRequest = (req: Request): boolean => {
    console.log("ValidateRequest (req) : ", req.body);
    const { db_type, store_code, where, set } = req.body as IMyRequestData;

    if (where)
        delete req.body['where'];

    if (!db_type || !store_code || !set) {
        console.error("[sign-up][ValidateRequest] main key is undefined!");
        return false;
    }

    const { user_email, user_name, user_password } = set as ISignUpData;

    if (!user_email || !user_name || !user_password) {
        console.error("[sign-up][ValidateRequest] SignUp key is incomplete!");
        return false;
    }

    return true;
};












/**
 * Controller for handling user sign-up requests.
 * Validates request structure, checks for XSS in username, and prepares
 * a response object to be passed to the central auth service.
 *
 * @function AuthSignUpController
 * @param {any} helpers - A utility or helper service object injected into the controller.
 * @returns {(req: Request) => Promise<IReturnToControllerCenter>} An async function that processes the request.
 */
export const AuthSignUpController = (helpers: any) => async (req: Request): Promise<IReturnToControllerCenter> => {
    try {
        console.log('AuthSignUpController :', req.body);

        const shouldContinue = ValidateRequest(req);
        if (!shouldContinue) throw { kind: 'incomplete_request' };
        console.log('AuthSignUpController (validRequestFormat) : ', req.body);

        const validRequestData = req.body as IMyRequestData;
        const setObjSignUp = validRequestData['set'] as ISignUpData;

        CheckerXSS(setObjSignUp['user_name']);

        const dataToCenterController: IReturnToControllerCenter = {
            data: validRequestData,
            feature: 'sign-up'
        };

        return dataToCenterController;
    } catch (error: any) {
        console.log('AuthSignUpController (Error):', error);
        throw { ...error, feature: 'sign-up' };
    }
};
