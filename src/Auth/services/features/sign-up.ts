import { loadEnvConfig } from "@Configs/env";
import { ArgonHashPassword } from "@Helper/Utils/Helper.auth.utils";
import { IReturnToCenterServiceData } from "@SRC/Auth/models/auth.global.model";
import { IServiceFeatureProps } from "@SRC/Auth/models/auth.sign-in.model";
import { ISignUpData } from "@SRC/Auth/models/auth.sign-up.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { sendDiscordWebhook } from "@SRC/Helper/Supplier";
import { Response } from "express";

const RAW_ENV = loadEnvConfig();

/**
 * List of forbidden words that are not allowed in usernames.
 * Used to prevent inappropriate or reserved usernames.
 *
 * @constant {string[]} forbiddenWords
 */
const forbiddenWords = ['root', 'admin', 'support', 'moderator', 'fuck', 'shit', 'bitch'];

/**
 * Check if a username contains any forbidden word.
 *
 * @function ContainsForbiddenWord
 * @param {string} username - The username to check.
 * @returns {boolean} True if the username contains a forbidden word, otherwise false.
 */
const ContainsForbiddenWord = (username: string): boolean => {
    const lower = username.toLowerCase();
    return forbiddenWords.some(word => lower.includes(word));
};







/**
 * Validate the sign-up data format including email, password, and username.
 * Throws an error if any field is invalid or contains unsafe/forbidden values.
 *
 * @function ValidateSignUpData
 * @param {IMyRequestData} validRequestData - The sign-up request payload to validate.
 * @throws Will throw an error object with a specific `kind` if validation fails.
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

const ValidateSignUpData = (validRequestData: IMyRequestData) => {
    try {
        const setObj = validRequestData.set;

        if (!setObj) return;

        const email: string = setObj.user_email;
        const password: string = setObj.user_password;
        const userName: string = setObj.user_name;

        if (!email || !emailRegex.test(email)) {
            console.error("[sign-up][ValidateRequest] email is invalid!");
            throw { kind: 'email_invalid' };
        }

        if (!password || password.length <= 8) {
            console.error("[sign-up][ValidateRequest] Password must be at least 8 characters!");
            throw { kind: 'password_must_be_less' };
        }

        if (!passwordStrengthRegex.test(password)) {
            console.error("[sign-up][ValidateRequest] Weak password.");
            throw { kind: 'weak_password' };
        }

        if (!userName || userName.length > 50) {
            console.error("[sign-up][ValidateRequest] Username must be less than 50 characters!");
            throw { kind: 'username_must_be_more' };
        }

        if (ContainsForbiddenWord(userName)) {
            console.error("[sign-up][ValidateRequest] Username has forbidden words!");
            throw { kind: 'username_has_forbidden_words' };
        }
    } catch (error) {
        console.error("ValidateSignUpData error:", error);
        throw error;
    }
};










/**
 * Service function to handle user sign-up logic.
 * Validates data, hashes password, creates new user, and returns response.
 *
 * @async
 * @function AuthSignUpService
 * @param {IServiceFeatureProps} params - Sign-up service parameters including request and validated data.
 * @param {Request} params.httpRequest - HTTP request object.
 * @param {Response} params.httpResponse - HTTP response object.
 * @param {IMyRequestData} params.validRequestData - Validated request data for new user.
 * @param {string} params.feature - Feature key, e.g., 'sign-up'.
 * @returns {Promise<IReturnToCenterServiceData>} Returns response with success message and new user data (without password).
 * @throws Throws error if email already exists or validation fails.
 */
export const AuthSignUpService = (helpers: any) => async ({
    httpRequest,
    httpResponse,
    validRequestData,
    feature
}: IServiceFeatureProps): Promise<IReturnToCenterServiceData> => {
    try {
        console.log('AuthSignUpService :', validRequestData);
        const { StoreService } = helpers;

        // Validate input data
        ValidateSignUpData(validRequestData);

        const setObj = validRequestData.set as ISignUpData;

        // Hash password
        const hashedPassword = await ArgonHashPassword(setObj.user_password);
        console.log('AuthSignUpService (hashedPassword) : ', hashedPassword);

        setObj['user_password'] = hashedPassword;

        // Create user in data store
        const dataFromCenterServiceCreate = await StoreService(validRequestData, 'create');
        console.log('AuthSignUpService (dataFromCenterService) : ', dataFromCenterServiceCreate);

        // Remove password before sending response to client
        delete dataFromCenterServiceCreate[0]['user_password'];

        const dataToAuthServiceCenter: IReturnToCenterServiceData = {
            response: {
                message: "Successfully signed up !!",
                feature,
                data: dataFromCenterServiceCreate
            },
            status_code: 201
        };

        return dataToAuthServiceCenter;
    } catch (error: any) {
        console.log('AuthSignUpService (Error):', error);

        // Handle duplicate email error (MySQL)
        if ((error?.table === 'user_auth' && error?.code === '23505')
            || (validRequestData.store_code === "user_auth" && error?.sqlState === '23000')) {
            throw { kind: 'email_already_exist', feature: 'sign-up' };
        }

        throw error;
    }
};