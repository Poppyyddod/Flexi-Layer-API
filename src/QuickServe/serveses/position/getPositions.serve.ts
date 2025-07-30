import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { getAllPositionsRequestPreset, getOnePositionRequestPreset } from "../../presets/position/getPositions.preset";

/**
 * Controller to fetch a single position by its ID.
 * 
 * - Reads `posId` from route parameters.
 * - Validates presence of `posId`.
 * - Queries the database using `getOnePositionRequestPreset`.
 * - Returns the position data or error response.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Sends JSON response with position data or error.
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
 * Controller to fetch all positions.
 * 
 * - Queries the database using `getAllPositionsRequestPreset`.
 * - Returns all position records or a message if table is empty.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Sends JSON response with positions data or error.
 */
export const GetAllPosition = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllPosition : ', req.body);

        const response = await StoreService(getAllPositionsRequestPreset(), 'fetch');
        console.log('GetAllPosition (response) : ', response);

        if (response.length === 0) {
            return res.status(200).json({
                message: "No row in the table!",
                quick_serve_name: 'GetAllPosition',
                success: false
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
 * Handles errors for the position controllers.
 * 
 * - Sends a 404 response if error kind is `not_found_data`.
 * - Sends a 500 response for other errors.
 * 
 * @param {Response} res - Express response object.
 * @param {any} error - The error object caught.
 * @param {string} quick_serve_name - Identifier of the quick serve feature for logging.
 * @returns {Response} - Express response with error JSON.
 */
const HandleError = (res: Response, error: any, quick_serve_name: string) => {
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
