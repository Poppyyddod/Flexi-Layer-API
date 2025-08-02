import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { getAllUserIdAndUsernameRequestPreset } from "../../presets/auth.preset";
import errorHandles from "@SRC/Helper/Data/Error";


export const GetAllEmployeeAuth = async (req: any, res: Response): Promise<any> => {
    try {
        const response = await StoreService(getAllUserIdAndUsernameRequestPreset(), 'fetch');
        console.log('GetAllEmployeeAuth(user_id, user_name) :', response);

        res.status(200).json({
            message: 'Successfully GetAllEmployeeAuth Served!',
            quick_serve_name: 'GetAllEmployeeAuth',
            success: true,
            data: response
        });
    } catch (error: any) {
        console.log('GetAllEmployeeAuth (Error):', error);
        await errorHandles(error, res, { systemName: 'Auth', feature: 'GetAllEmployeeAuth' });
        // Optionally fallback to HandleError(res, error, 'GetMe');
    }
};

/**
 * Handles known and unknown errors for the GetMe controller.
 *
 * @param {Response} res - Express response object.
 * @param {any} error - The error object.
 * @param {string} quick_serve_name - Identifier for the quick serve feature.
 * @returns {Response} - The HTTP error response.
 */
const HandleError = (res: Response, error: any, quick_serve_name: string): Response => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown the user id!",
            quick_serve_name,
            success: false
        });
    }

    return res.status(500).json({
        message: "Failed to Serve!",
        quick_serve_name,
        success: false
    });
};
