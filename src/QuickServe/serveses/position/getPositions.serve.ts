import { getAllPositionsRequestPreset, getOnePositionRequestPreset } from "@SRC/QuickServe/presets/position.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";





/**
 * Handles the API request to retrieve a single position by its ID.
 *
 * - Expects a route parameter `posId`.
 * - Fetches position data using `getOnePositionRequestPreset`.
 * - Returns the position data in the response if found.
 *
 * @param {Request} req - Express request object, expects `posId` in route params.
 * @param {Response} res - Express response object for sending the result.
 * @returns {Promise<any>} - JSON response containing position data or error message.
 */
export const GetOnePosition = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOnePosition : ', req.body);

        const positonId = req.params.posId;
        if (!positonId) {
            return res.status(400).json({
                message: "Param positonId is required",
                quick_serve_name: 'GetOnePosition',
                success: false
            });
        }

        const response = await StoreService(getOnePositionRequestPreset(positonId), 'fetch');
        console.log('GetOnePosition (response) : ', response);

        res.status(200).json({
            message: "Successfully GetOnePosition Served!",
            quick_serve_name: 'GetOnePosition',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOnePosition (Error):', error);
        HandleError(res, error, 'GetOnePosition');
    }
};




/**
 * Handles the API request to retrieve a list of all positions.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object for sending the result.
 *
 * @returns {Promise<any>} - JSON response containing the list of positions or an error message.
 *
 * @example
 * GET /quickserve/position
 */

export const GetAllPosition = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllPosition : ', req.body);

        const response = await StoreService(getAllPositionsRequestPreset(), 'fetch');
        console.log('GetAllPosition (response) : ', response);

        if (response?.kind === "null_data") {
            return res.status(200).json({
                message: "No rows found!",
                quick_serve_name: 'GetAllPosition',
                success: false,
                data: []
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllPosition Served!",
            quick_serve_name: 'GetAllPosition',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllPosition (Error):', error);
        HandleError(res, error, 'GetAllPosition');
    }
};




/**
 * Handles errors for position-related requests.
 *
 * - If the error is of kind `not_found_data`, returns 404 with a specific message.
 * - Otherwise, returns 500 with a general failure message.
 *
 * @param {Response} res - Express response object.
 * @param {any} error - The error object thrown during the request.
 * @param {string} quick_serve_name - The name of the current quick serve feature.
 * @returns {Response} - The formatted HTTP error response.
 */
const HandleError = (res: Response, error: any, quick_serve_name: string): Record<string, any> => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown position id!",
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
