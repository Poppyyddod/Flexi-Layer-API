import { IReturnToCenterServiceData } from "@SRC/Auth/models/auth.global.model";
import { IServiceFeatureProps } from "@SRC/Auth/models/auth.sign-in.model";

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

        // Remove the refresh token entry from the data store
        const dataFromServiceCenter = await StoreService(validRequestData, 'remove');
        console.log('AuthSignOutService (dataFromCenterService) : ', dataFromServiceCenter);

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
    } catch (error) {
        console.log('AuthSignOutService (Error):', error);
        throw error;
    }
}
