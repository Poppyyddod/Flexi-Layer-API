import ErrorHandles from "@Helper/Data/Error";
import Logger from "@Helper/Logger";
import { authControllerMethods, AuthControllerKeyRoutes } from "./method";
import AuthCenterService from "../services/auth.service";
import { Request, Response } from "express";
import { IReturnToCenterServiceData } from "../models/auth.global.model";


// Helper Function
const helperFunctions = {

}

/**
 * Main authentication controller handler.
 * Dynamically delegates requests to the appropriate auth controller
 * based on the incoming route, and then passes the result to the center service.
 * Also handles logging and error management.
 *
 * @async
 * @function AuthCenterController
 * @param {Request} req - The incoming HTTP request object.
 * @param {Response} res - The outgoing HTTP response object.
 * @returns {Promise<Response>} A promise that resolves with the HTTP response.
 *
 * @description
 * ## Flow Summary:
 * 1. Identifies the requested authentication route from `req.path`.
 * 2. Calls the appropriate controller handler using `authControllerMethods`.
 * 3. Sends the processed data to the `AuthCenterService` for centralized processing.
 * 4. Logs the response details.
 * 5. Returns the final processed response to the client.
 *
 * ## Error Handling (catch block):
 * - Catches any error thrown during controller or service execution.
 * - Enhances the error with metadata like `functionName` and `db_type`.
 * - Passes the error to a centralized `ErrorHandles()` function to log, format, and respond properly.
 */
const AuthCenterController = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log('> AuthCenterController : ', req.body);

        const theRoute = req.path as AuthControllerKeyRoutes;

        if (!(theRoute in authControllerMethods)) {
            return res.status(500).json({
                message: "Internal routing error (unknown auth route)",
            });
        }

        console.log(`- Request route : ${theRoute}`);

        const controller = authControllerMethods[theRoute];
        const dataFromTheController = await controller(helperFunctions)(req);
        console.log('AuthCenterController (response) : ', dataFromTheController);

        const dataFromCenterService: IReturnToCenterServiceData = await AuthCenterService({
            httpRequest: req,
            httpResponse: res,
            validRequestData: dataFromTheController.data,
            feature: dataFromTheController.feature
        });

        console.log('AuthCenterController : ', dataFromCenterService);

        Logger('Auth', 'info', {
            more: dataFromCenterService.response.data?.[0] || dataFromCenterService.response,
            feature: dataFromCenterService.response.feature
        });

        const { response, status_code } = dataFromCenterService;

        return res.status(status_code).json({
            ...response
        });
    } catch (error: any) {
        console.log('AuthCenterController (error) : ', error);

        // Add metadata to error before passing to centralized error handler
        const theError = {
            ...error,
            functionName: `${error.feature} auth`,
            db_type: req.body.db_type
        };

        return await ErrorHandles(theError, res, {
            systemName: 'Auth',
            feature: error.feature
        });
    }
};

export default AuthCenterController;
