import errorHandles from "@SRC/Helper/Data/Error";
import { StartWorkRecordType } from "@SRC/QuickServe/models/workRecord.model";

import { startWorkRecordRequestPreset } from "@SRC/QuickServe/presets/work_record/startWorkRecord.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";


/**
 * Validates the required fields in the Start Work Record request body.
 *
 * @param {Request} req - The Express request object containing the work record data in the body.
 * @param {Response} res - The Express response object.
 * @returns {boolean} - Returns `true` if all required fields are present, otherwise `false`.
 */
const ValidateStartWorkRecord = (req: Request, res: Response): boolean => {
    const { emp_id, start_latitude, start_longitude, start_at } = req.body as StartWorkRecordType;

    if (!emp_id || !start_latitude || !start_longitude) return false;

    return true;
};



/**
 * Handles the logic to create a work record.
 * 
 * - Validates the request body for necessary fields (emp_id, start_latitude, start_longitude, start_at).
 * - Generates a request preset using `startWorkRecordRequestPreset`.
 * - Calls `StoreService` to store the work record in the database.
 * - Responds with a success message and the stored data on successful creation.
 * 
 * @param {Request} req - The Express request object containing work record data.
 * @param {Response} res - The Express response object.
 * @returns {Promise<any>} - The JSON response indicating success or failure of the operation.
 */
export const StartWorkRecord = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('StartWorkRecord : ', req.body);

        const shouldContinue = ValidateStartWorkRecord(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'StartWorkRecord',
                guide: {
                    emp_id: "number",
                    start_latitude: "string",
                    start_longitude: "string",
                },
                success: false
            });
        }

        const bodyData = req.body as StartWorkRecordType;
        const preset = startWorkRecordRequestPreset(bodyData);

        const response = await StoreService(preset, 'create');
        console.log('StartWorkRecord (response) : ', response);

        return res.status(201).json({
            message: "Successfully StartWorkRecord Served!",
            quick_serve_name: 'StartWorkRecord',
            success: true,
            data: response
        });
    } catch (error: any) {
        console.log('StartWorkRecord (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'create-one-employee' });
        } else {
            HandleError(res, error, 'StartWorkRecord');
        }
    }
};


/**
 * Handles errors for the StartWorkRecord controller.
 * 
 * - Sends a 404 response if error code is `ER_NO_REFERENCED_ROW_2`.
 * - Sends a 500 response for other errors.
 * 
 * @param {Response} res - Express response object used to return the result.
 * @param {any} error - The error object caught.
 * @param {string} quick_serve_name - Identifier of the quick serve feature for logging.
 * @returns {Response} - Express response with error JSON.
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
 * Handles foreign key constraint violations by parsing the error message
 * and returning a detailed response to the client.
 *
 * Extracts information about the constraint, including the field, table,
 * and referenced field involved in the violation. Returns a 404 response
 * with a message indicating an invalid foreign key reference.
 *
 * @param {any} error - The error object containing SQL constraint failure details.
 * @param {Response} res - The Express response object used to send the HTTP response.
 * @param {string} quick_serve_name - The name of the quick serve feature triggering the error.
 * @returns {Record<string, any>} - A JSON response describing the invalid reference.
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