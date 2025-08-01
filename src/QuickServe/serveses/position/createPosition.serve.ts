import errorHandles from "@SRC/Helper/Data/Error";
import { AddPositionType } from "@SRC/QuickServe/models/position.model";
import { createPositionRequestPreset } from "@SRC/QuickServe/presets/position/createPosition.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



/**
 * Validates the request body for necessary fields (position_name, position_salary) to add a new position.
 *
 * @param {Request} req - The Express request object containing the position data in the body.
 * @param {Response} res - The Express response object, unused in this function.
 * @returns {boolean} - Returns `true` if both required fields are present, otherwise `false`.
 */
const ValidateAddPosition = (req: Request, res: Response): boolean => {
    const { position_name, position_salary } = req.body as AddPositionType;

    if (!position_name || !position_salary) return false;

    return true;
};




/**
 * Handles the logic to create a new position.
 * 
 * - Validates the request body for necessary fields (position_name, position_salary).
 * - Generates a request preset using `createPositionRequestPreset`.
 * - Calls `StoreService` to store the position in the database.
 * - Responds with a success message and the stored data on successful creation.
 * 
 * @param {Request} req - The Express request object containing the position data in the body.
 * @param {Response} res - The Express response object.
 * @returns {Promise<any>} - The JSON response indicating success or failure of the operation.
 */
export const AddPosition = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('AddPosition : ', req.body);

        const shouldContinue = ValidateAddPosition(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'AddPosition',
                guide: {
                    position_name: "string",
                    position_salary: "number",
                },
                success: false
            });
        }

        const bodyData = req.body as AddPositionType;
        const preset = createPositionRequestPreset(bodyData);

        const response = await StoreService(preset, 'create');

        return res.status(201).json({
            message: "Successfully AddPosition Served!",
            quick_serve_name: 'AddPosition',
            success: true,
            data: response
        });
    } catch (error: any) {
        console.log('AddPosition (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'AddPosition' });
        } else {
            HandleError(res, error, 'AddPosition');
        }
    }
};



/**
 * Generic error handler for database-related and unknown errors.
 *
 * @param {Response} res - The Express response object.
 * @param {any} error - The caught error during execution.
 * @param {string} quick_serve_name - The identifier name of the quick serve feature.
 * @returns {Response} - The HTTP response with appropriate error message.
 */

const HandleError = (res: Response, error: any, quick_serve_name: string): Record<string, any> => {
    if (error?.code === "ER_NO_REFERENCED_ROW_2") {
        return NoReferenceRow2(error, res, quick_serve_name);
    }

    return res.status(500).json({
        message: "Failed to Serve!",
        quick_serve_name,
        success: false
    });
};



/**
 * Handles foreign key constraint violation (ER_NO_REFERENCED_ROW_2).
 * Extracts and formats useful details for the client to understand the issue.
 * 
 * @param {any} error - The error object containing SQL constraint failure.
 * @param {Response} res - The Express response object.
 * @param {string} quick_serve_name - The identifier name of the quick serve feature.
 * @returns {Response} - A detailed error response describing the invalid reference.
 */
const NoReferenceRow2 = (error: any, res: Response, quick_serve_name: string): Record<string, any> => {
    const match = error?.sqlMessage?.match(/CONSTRAINT `(.*?)` FOREIGN KEY \(`(.*?)`\) REFERENCES `(.*?)` \(`(.*?)`\)/);
    const field = match ? match[2] : "unknown_field";
    const table = match ? match[3] : "unknown_table";
    const referencedField = match ? match[4] : "unknown_column";

    return res.status(404).json({
        message: "Invalid foreign key reference",
        read_me: "The data you are trying to link (foreign key) doesn't exist in the referenced table.",
        detail: `Field '${field}' in this request does not match any existing '${referencedField}' in the '${table}' table.`,
        quick_serve_name,
        success: false
    });
};