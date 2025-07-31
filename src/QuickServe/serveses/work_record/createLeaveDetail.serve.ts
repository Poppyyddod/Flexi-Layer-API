

import errorHandles from "@SRC/Helper/Data/Error";
import { CreateLeaveDetailType } from "@SRC/QuickServe/models/workRecord.model";
import { createLeaveDetailRequestPreset } from "@SRC/QuickServe/presets/work_record/leaveWorkRecord.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";





/**
 * Handles the logic to create a leave work record.
 * 
 * - Validates the request body for necessary fields (emp_id, start_latitude, start_longitude).
 * - Generates a request preset using `leaveWorkRecordRequestPreset`.
 * - Calls `StoreService` to store the leave work record in the database.
 * - Responds with a success message and the stored data on successful creation.
 * 
 * @param {Request} req - The Express request object containing work record data.
 * @param {Response} res - The Express response object.
 * @returns {Promise<any>} - The JSON response indicating success or failure of the operation.
 */

export const CreateLeaveDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('CreateLeaveDetail : ', req.body);

        const bodyData = req.body as CreateLeaveDetailType;
        if (!bodyData.emp_id
            || !bodyData.leave_type_name || !bodyData.leave_start_at
            || !bodyData.leave_end_at) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'CreateLeaveDetail',
                guide: {
                    emp_id: "number",
                    leave_type_name: "string",
                    leave_start_at: "string",
                    leave_end_at: "string",
                    detail: "string",
                    image: "optional"
                },
                success: false
            });
        }

        const preset = createLeaveDetailRequestPreset(bodyData);

        const response = await StoreService(preset, 'create');
        console.log('CreateLeaveDetail (response) : ', response);

        return res.status(201).json({
            message: "Successfully CreateLeaveDetail Served!",
            quick_serve_name: 'CreateLeaveDetail',
            success: true,
            data: response
        });
    } catch (error: any) {
        console.log('CreateLeaveDetail (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'create-one-employee' });
        } else {
            HandleError(res, error, 'CreateLeaveDetail');
        }
    }
};


/**
 * Handles errors for the CreateLeaveDetail controller.
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