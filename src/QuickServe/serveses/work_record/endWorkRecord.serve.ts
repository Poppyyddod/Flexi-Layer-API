import errorHandles from "@SRC/Helper/Data/Error";
import { EndWorkRecordType } from "@SRC/QuickServe/models/workRecord.model";
import { endWorkRecordRequestPreset } from "@SRC/QuickServe/presets/work_record/endWorkRecord.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";


/**
 * Validates the request body and route parameter for EndWorkRecord.
 *
 * @param {Request} req - Express request object containing the request body and route parameter.
 * @param {Response} res - Express response object used to return the result.
 * @returns {boolean} - Returns `true` if all required fields are present, otherwise `false`.
 */
const ValidateEndWorkRecord = (req: Request, res: Response): boolean => {
    const { end_latitude, end_longitude } = req.body as EndWorkRecordType;

    if (!end_latitude || !end_longitude) return false;

    const empId = req.params.empId;

    if (!empId) return false;

    return true;
}


/**
 * Handles the request to update an existing work record's end details.
 *
 * - Validates the request body and `empId` route parameter.
 * - Updates the `end_latitude` and `end_longitude` fields in the work record.
 * - Calls the `StoreService` to update the record in the database.
 * - Responds with success message and affected rows count on successful update.
 *
 * @param {Request} req - Express request object containing the request body and route parameter.
 * @param {Response} res - Express response object used to return the result.
 * @returns {Promise<any>} - JSON response indicating success or failure of the operation.
 */

export const EndWorkRecord = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('EndWorkRecord : ', req.body);

        const shouldContinue = ValidateEndWorkRecord(req, res);
        if (!shouldContinue) throw { kind: 'incomplete_request' };

        const empIdParam = req.params.empId;
        const bodyData = req.body as EndWorkRecordType
        const preset = endWorkRecordRequestPreset(empIdParam, bodyData);

        const response = await StoreService(preset, 'edit');
        console.log('EndWorkRecord (response) : ', response);

        return res.status(200).json({
            message: "Successfully EndWorkRecord Served!",
            quick_serve_name: 'EndWorkRecord',
            success: true,
            data: {
                affectedRows: response.affectedRows
            }
        });
    } catch (error: any) {
        console.log('EndWorkRecord (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'end-work-record' });
        } else {
            HandleError(res, error, 'EndWorkRecord');
        }
    }
}



/**
 * Handles errors for the EndWorkRecord controller.
 * 
 * - Sends a 404 response if error kind is `not_found_data`.
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
}



/**
 * Handles foreign key constraint violation (ER_NO_REFERENCED_ROW_2).
 * Extracts and formats useful details for the client to understand the issue.
 * 
 * @param {any} error - The error object containing SQL constraint failure.
 * @param {Response} res - The Express response object.
 * @param {string} quick_serve_name - The identifier name of the quick serve feature.
 * @returns {Response} - A detailed error response describing the invalid reference.
 */
const NoReferenceRow2 = (error: any, res: Response, quick_serve_name: string) => {
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
}