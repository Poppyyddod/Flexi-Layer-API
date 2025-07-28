import { ArgonComparePassword, JwtGenerateToken } from "@Helper/Utils/Helper.auth.utils";
import { IReturnToCenterServiceData } from "@SRC/Auth/models/auth.global.model";
import { IServiceFeatureProps, ISignInData, IUserAuthTableField } from "@SRC/Auth/models/auth.sign-in.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { ToMySQLDateTime } from "@SRC/Helper/Utils";



/**
 * Fetch user authentication data from the store service based on the email.
 *
 * @async
 * @function GetUserAuthData
 * @param {any} StoreService - The data service function to query the database.
 * @param {IMyRequestData} validRequestData - Validated request data containing DB type, store code, and user email.
 * @returns {Promise<any>} Returns the user data fetched from the data store.
 */
const GetUserAuthData = async (StoreService: any, validRequestData: IMyRequestData): Promise<any> => {
    const { db_type, store_code, where } = validRequestData;
    const { user_email } = where as ISignInData;

    const dataToStoreServiceCenter = {
        db_type,
        store_code,
        field_list: "*",
        where: {
            user_email
        }
    };

    const dataFromServiceCenter = await StoreService(dataToStoreServiceCenter, 'fetch');
    return dataFromServiceCenter;
}


// const CheckAlreayRefreshToken = () => {

// }



/**
 * Create and store a new refresh token for the authenticated user.
 *
 * @async
 * @function CreateUserRefreshToken
 * @param {any} StoreService - The data service function to perform database operations.
 * @param {any} userAuthData - The authenticated user data including user ID.
 * @returns {Promise<void>} Resolves when the refresh token is created and stored.
 */
const CreateUserRefreshToken = async (StoreService: any, userAuthData: any): Promise<void> => {
    const generatedRefreshToken = await JwtGenerateToken(userAuthData.user_id, "7d");
    console.log('[AuthSignInService] Refresh Token generated successfully.');

    const dataToCreate = {
        db_type: "mysql",
        store_code: "user_refresh_tokens",
        set: {
            user_id: userAuthData.user_id,
            refresh_token: generatedRefreshToken,
            expires_at: ToMySQLDateTime(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        }
    };

    const dataFromCenterService = await StoreService(dataToCreate, 'create');
    console.log('CreateUserRefreshToken (dataFromCenterService) : ', dataFromCenterService);
}





/**
 * Update the authentication status of a user to "Signed In".
 * It edits the "auth_status_id" field in the "user_auth" table to 3 (Signed In).
 *
 * @async
 * @function EditAuthStatusToSignedInState
 * @param {any} StoreService - The data service function to perform database operations.
 * @param {any} userAuthData - The authenticated user data including user ID.
 * @returns {Promise<void>} Resolves when the authentication status is updated.
 */

const EditAuthStatusToSignedInState = async (StoreService: any, userAuthData: IUserAuthTableField): Promise<void> => {
    const dataToCreate = {
        db_type: "mysql",
        store_code: "user_auth",
        where: { user_id: userAuthData.user_id! },
        set: { auth_status_id: 3 }
    };

    const dataFromCenterService = await StoreService(dataToCreate, 'edit');
    console.log('CreateUserRefreshToken (dataFromCenterService) : ', dataFromCenterService);
}






/**
 * Service function to handle user sign-in logic.
 * Fetches user data, verifies password, generates JWT tokens,
 * and creates a refresh token entry in the database.
 *
 * @async
 * @function AuthSignInService
 * @param {IServiceFeatureProps} params - The service parameters including request, response, validated data, and feature key.
 * @param {Request} params.httpRequest - The HTTP request object.
 * @param {Response} params.httpResponse - The HTTP response object.
 * @param {IMyRequestData} params.validRequestData - Validated request data.
 * @param {string} params.feature - Feature key, e.g., 'sign-in'.
 * @returns {Promise<IReturnToCenterServiceData>} Returns a standardized response data object.
 * @throws Throws error if password is incorrect or any other error occurs during sign-in.
 */
export const AuthSignInService = (helpers: any) => async ({
    httpRequest,
    httpResponse,
    validRequestData,
    feature
}: IServiceFeatureProps): Promise<IReturnToCenterServiceData> => {
    try {
        console.log('AuthSignInService :', validRequestData);

        const { StoreService } = helpers;
        const whereObj = validRequestData.where as ISignInData;

        // Get User Auth Data By Store System
        const dataFromServiceCenter = await GetUserAuthData(StoreService, validRequestData);
        console.log('AuthSignInService (dataFromCenterService) : ', dataFromServiceCenter);

        // Auth Data
        const userAuthData = dataFromServiceCenter[0] as IUserAuthTableField;

        if (userAuthData) {
            // Check Auth Status
            const allowToCreateRefreshToken = [1, 2];
            if (!allowToCreateRefreshToken.includes(userAuthData.auth_status_id))
                throw { kind: "already_signed_in", feature };
        }

        // Compare Password With Argon2
        const comparedPassword: boolean = await ArgonComparePassword(whereObj.user_password!, userAuthData.user_password!);
        console.log('AuthSignInService (comparedPassword) : ', comparedPassword);

        if (!comparedPassword) {
            throw { kind: 'incorrect_auth_data' };
        }

        // Delete Password Key From User Auth Data
        delete userAuthData['user_password'];

        // Generate Access Token (JWT)
        const generatedAccessToken = await JwtGenerateToken(userAuthData.user_id!, "1d");
        console.log('[AuthSignInService] Access Token generated successfully.');
        userAuthData['token'] = generatedAccessToken;

        // Create Refresh Token
        await CreateUserRefreshToken(StoreService, userAuthData);

        // Edit Auth Status To Signed In State
        await EditAuthStatusToSignedInState(StoreService, userAuthData);

        const dataToAuthServiceCenter: IReturnToCenterServiceData = {
            response: {
                message: "Successfully signed in !!",
                feature,
                data: userAuthData
            },
            status_code: 200
        };

        return dataToAuthServiceCenter;
    } catch (error: any) {
        console.log('AuthSignInService (Error):', error);

        if (error?.kind === 'not_found_data') {
            throw { kind: 'incorrect_auth_data', feature: 'sign-in' };
        }

        throw error;
    }
}
