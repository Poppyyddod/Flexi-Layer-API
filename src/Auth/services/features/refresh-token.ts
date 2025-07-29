import { IServiceFeatureProps, IUserAuthTableField } from "@SRC/Auth/models/auth.sign-in.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { JwtGenerateToken } from "@SRC/Helper/Utils/Helper.auth.utils";
import { Request, Response } from "express";
import { ToMySQLDateTime } from "@SRC/Helper/Utils";
import { IReturnToCenterServiceData } from "@SRC/Auth/models/auth.global.model";






/**
 * Updates an existing refresh token with a new one for the given user.
 * This is typically used to rotate the refresh token on usage.
 *
 * @async
 * @function UpdateUserRefreshToken
 * @param {any} StoreService - The service function used to interact with the data store.
 * @param {string} oldRefreshToken - The old refresh token to find and update.
 * @param {number|string} userId - The ID of the user associated with the token.
 * @returns {Promise<string>} A promise that resolves to the new refresh token.
 * @throws Will throw an error if update operation fails.
 */
export const UpdateUserRefreshToken = async (
    StoreService: any,
    oldRefreshToken: string,
    userAuthData: IUserAuthTableField
): Promise<string> => {
    try {
        const newRefreshToken = await JwtGenerateToken(userAuthData, "7d");

        const expiresAt = ToMySQLDateTime(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        const dataToUpdate = {
            db_type: "mysql",
            store_code: "user_refresh_tokens",
            where: {
                refresh_token: oldRefreshToken
            },
            set: {
                refresh_token: newRefreshToken,
                expires_at: expiresAt,
                updated_at: ToMySQLDateTime(new Date()),
                is_revoked: 0
            }
        };

        await StoreService(dataToUpdate, "edit");

        return newRefreshToken;
    } catch (error) {
        console.error("[UpdateUserRefreshToken] Error:", error);
        throw error;
    }
};







/**
 * Retrieves refresh token data from the store using the provided request.
 *
 * @async
 * @function GetRefreshTokenData
 * @param {IMyRequestData} validRequestData - Validated request object containing refresh token.
 * @param {any} StoreService - The service function used to fetch data.
 * @returns {Promise<any>} The user refresh token record from the data store.
 * @throws Will throw an error if fetch operation fails.
 */
const GetRefreshTokenData = async (validRequestData: IMyRequestData, StoreService: any): Promise<any> => {
    try {
        console.log('[GetRefreshTokenData] :', validRequestData);

        const refreshToken = validRequestData.where.refresh_token;

        const dataFromService = await StoreService({
            db_type: 'mysql',
            store_code: 'user_refresh_tokens',
            field_list: "*",
            where: {
                refresh_token: refreshToken
            }
        }, 'fetch');

        return dataFromService[0];
    } catch (error: any) {
        console.log('GetRefreshTokenData (Error):', error);
        throw error;
    }
};






const GetUserAuthData = async (StoreService: any, userId: string | number) => {
    try {
        const dataToUpdate = {
            db_type: "mysql",
            store_code: "user_auth",
            field_list: "*",
            where: {
                user_id: userId
            }
        };

        const userAuthData = await StoreService(dataToUpdate, "edit");
        console.log('GetUserAuthData (userAuthData) : ', userAuthData);

        delete userAuthData['user_password'];

        return userAuthData;
    } catch (error) {
        console.log('GetUserAuthData (Error):', error);
    }
}








/**
 * Service that handles refreshing of access and refresh tokens.
 * Validates the current refresh token, checks expiry, and issues new tokens.
 *
 * @async
 * @function AuthRefreshTokenService
 * @param {IServiceFeatureProps} props - The service props containing request, response, and request data.
 * @param {Request} props.httpRequest - HTTP request object.
 * @param {Response} props.httpResponse - HTTP response object.
 * @param {IMyRequestData} props.validRequestData - Validated refresh token request data.
 * @param {string} props.feature - The current feature name, typically 'refresh-token'.
 * @returns {Promise<IReturnToCenterServiceData>} A response object containing new access and refresh tokens.
 * @throws Will throw an error if token is invalid, expired, or store interaction fails.
 */
export const AuthRefreshTokenService = (helpers: any) => async ({
    httpRequest,
    httpResponse,
    validRequestData,
    feature
}: IServiceFeatureProps): Promise<IReturnToCenterServiceData> => {
    try {
        console.log('[AuthRefreshTokenService] :', validRequestData);

        const { StoreService } = helpers;

        const refreshTokenData: any = await GetRefreshTokenData(validRequestData, StoreService);

        const now = new Date();
        if (new Date(refreshTokenData.expires_at) < now) {
            throw { kind: 'refresh_token_expired' };
        }

        const userAuthData: any = await GetUserAuthData(StoreService, refreshTokenData.user_id);
        console.log('AuthRefreshTokenService (userAuthData) : ', userAuthData);

        const newAccessToken = await JwtGenerateToken(userAuthData, "1d");
        const newRefreshToken = await UpdateUserRefreshToken(StoreService, refreshTokenData.refresh_token, userAuthData);

        const dataToAuthServiceCenter: IReturnToCenterServiceData = {
            response: {
                message: "Refreshed access token successfully.",
                feature,
                data: {
                    new_access_token: newAccessToken,
                    new_refresh_token: newRefreshToken
                }
            },
            status_code: 200
        }

        return dataToAuthServiceCenter;
    } catch (error: any) {
        console.log('AuthRefreshTokenService (Error):', error);

        if (error?.kind === "not_found_data") {
            throw { kind: 'refresh_token_revoked' };
        }

        throw error;
    }
};
