import StoreService from "@Store/services";
import { AuthServiceKey, authServiceMethod } from "./method";
import { IServiceFeatureProps } from "../models/auth.sign-in.model";
import { IReturnToCenterServiceData } from "../models/auth.global.model";


const helperFunctions = {
    StoreService,
}


/**
 * Central authentication service handler.
 * Delegates authentication requests to the correct service function
 * based on the `feature` key provided, and handles response flow.
 *
 * @async
 * @function AuthCenterService
 * @param {IServiceFeatureProps} props - Properties for the service including request, response, validated data, and feature key.
 * @param {Request} props.httpRequest - The incoming Express request object.
 * @param {Response} props.httpResponse - The outgoing Express response object.
 * @param {IMyRequestData} props.validRequestData - The validated and parsed request body.
 * @param {AuthServiceKey} props.feature - The key representing which service (e.g., 'sign-in', 'sign-up') to invoke.
 * @returns {Promise<IReturnToCenterServiceData>} A Promise resolving with the service response structure.
 *
 * @throws Will throw an error if the `feature` key is not valid or if the delegated service throws.
 *
 * @description
 * ## Function Workflow:
 * 1. Casts the `feature` key to `AuthServiceKey`.
 * 2. Validates if the `feature` exists in `authServiceMethod`.
 * 3. If valid, retrieves the corresponding service function.
 * 4. Calls the service with injected helper functions and request context.
 * 5. Logs and returns the service result.
 * 6. If invalid feature or error occurs during service execution, logs and throws the error.
 */
const AuthCenterService = async ({
    httpRequest,
    httpResponse,
    validRequestData,
    feature
}: IServiceFeatureProps): Promise<IReturnToCenterServiceData> => {
    try {
        console.log('> AuthCenterService : ', validRequestData);

        const theFeature = feature as AuthServiceKey;

        const service = authServiceMethod[theFeature];
        if (!(theFeature in authServiceMethod)) {
            httpResponse.status(500).json({ message: "Invalid service feature key!" });
            throw new Error("Invalid service feature key!");
        }

        const dataFromTheService: IReturnToCenterServiceData = await service(helperFunctions)({
            httpRequest,
            httpResponse,
            validRequestData,
            feature
        });
        console.log('AuthCenterService (dataFromTheService) : ', dataFromTheService);

        return dataFromTheService;
    } catch (error) {
        console.log('AuthCenterService (Error):', error);
        throw error;
    }
};


export default AuthCenterService;