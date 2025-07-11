import { IReturnToCenterServiceData } from "@SRC/Auth/models/auth.global.model";
import { IServiceFeatureProps, ISignInData, IUserAuthTableField } from "@SRC/Auth/models/auth.sign-in.model";



/**
 * Service function to update the authentication status of a user to "Signed Out".
 * It edits the "auth_status_id" field in the "user_auth" table to 2 (Signed Out).
 *
 * @async
 * @function EditAuthStatusToSignedOutState
 * @param {any} StoreService - The data service function to perform database operations.
 * @param {number} userId - The ID of the user to update the authentication status.
 * @returns {Promise<void>} Resolves when the authentication status is updated.
 */

const EditAuthStatusToSignedOutState = async (StoreService: any, userId: number): Promise<void> => {
    const dataToEdit = {
        db_type: "mysql",
        store_code: "user_auth",
        where: { user_id: userId },
        set: { auth_status_id: 2 }
    };

    const dataFromCenterService = await StoreService(dataToEdit, 'edit');
    console.log('CreateUserRefreshToken (dataFromCenterService) : ', dataFromCenterService);
}

/**
 * Service function to handle user sign-out logic.
 * It removes the user's refresh token from the data store,
 * effectively signing the user out.
 *
 * @async
 * @function AuthSignOutService
 * @param {IServiceFeatureProps} params - Service parameters including request, response, validated data, and feature key.
 * @param {Request} params.httpRequest - The HTTP request object.
 * @param {Response} params.httpResponse - The HTTP response object.
 * @param {IMyRequestData} params.validRequestData - Validated request data containing sign-out details.
 * @param {string} params.feature - Feature key, e.g., 'sign-out'.
 * @returns {Promise<IReturnToCenterServiceData>} Returns a standardized response indicating sign-out success.
 * @throws Throws an error if the data store operation fails.
 */
export const AuthSignOutService = (helpers: any) => async ({
    httpRequest,
    httpResponse,
    validRequestData,
    feature
}: IServiceFeatureProps): Promise<IReturnToCenterServiceData> => {
    try {
        console.log('AuthSignOutService :', validRequestData);

        const { StoreService } = helpers;

        // Set the store code to the user refresh token table
        validRequestData['store_code'] = "user_refresh_tokens";

        const whereObj = validRequestData.where as IUserAuthTableField;

        // Remove the refresh token entry from the data store
        const dataFromServiceCenter = await StoreService(validRequestData, 'delete');
        console.log('AuthSignOutService (dataFromCenterService) : ', dataFromServiceCenter);

        // Update the auth status to signed out
        await EditAuthStatusToSignedOutState(StoreService, whereObj.user_id!);

        // Prepare the response data for the controller
        const dataToAuthServiceCenter: IReturnToCenterServiceData = {
            response: {
                message: "Successfully signed out !!",
                feature,
                data: {
                    query: validRequestData,
                    affectedRows: dataFromServiceCenter.affectedRows,
                }
            },
            status_code: 200
        };

        return dataToAuthServiceCenter;
    } catch (error: any) {
        console.log('AuthSignOutService (Error):', error);

        if (error?.kind === 'not_found_data') {
            throw { kind: 'already_signed_out', feature: 'sign-out' };
        }

        throw error;
    }
}
