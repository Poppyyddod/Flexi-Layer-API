import errorHandles from "@SRC/Helper/Data/Error";
import { isString } from "@SRC/Helper/Utils";
import useDeduction from "@SRC/QuickServe/composables/useDeduction";
import useSalary from "@SRC/QuickServe/composables/useSalary";
import { ApproveLeaveWorkRecordType } from "@SRC/QuickServe/models/workRecord.model";
import { approveLeaveWorkRecordPreset, approveRejectedWorkRecordPreset } from "@SRC/QuickServe/presets/work_record/approveLeaveWorkRecord.preset";
import { endWorkRecordRequestPreset } from "@SRC/QuickServe/presets/work_record/endWorkRecord.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";


/**
 * Validates the request body and route parameter for ApproveLeaveWorkRecord.
 *
 * @param {Request} req - Express request object containing the request body and route parameter.
 * @param {Response} res - Express response object used to return the result.
 * @returns {boolean} - Returns `true` if all required fields are present, otherwise `false`.
 */
const ValidateApproveLeaveWorkRecord = (req: Request): boolean => {
    const { approve_state } = req.body as ApproveLeaveWorkRecordType;

    if (!approve_state || !approve_state) return false;

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

const approveStatus = ['approved', 'considering', 'rejected'];

export const ApproveLeaveWorkRecord = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('ApproveLeaveWorkRecord : ', req.body);

        const shouldContinue = ValidateApproveLeaveWorkRecord(req);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'StartWorkRecord',
                guide: {
                    approve_state: "string"
                },
                success: false
            });
        }

        const empIdParam = req.params.empId;
        const bodyData = req.body as ApproveLeaveWorkRecordType

        if (!approveStatus.includes(bodyData.approve_state)) {
            return res.status(400).json({
                message: "Invalid approve state!",
                quick_serve_name: 'ApproveLeaveWorkRecord',
                details: `Unknown '${bodyData.approve_state}' approve state.`,
                allowed: `${approveStatus.join(', ')}`,
                success: false
            });
        }

        const preset = approveLeaveWorkRecordPreset(empIdParam, bodyData);

        const response = await StoreService(preset, 'edit');
        console.log('ApproveLeaveWorkRecord (response) : ', response);

        // #This feature is considering
        if (bodyData.approve_state === "rejected") {
            await OnApproveLeaveRejected(req, res);
        }

        return res.status(200).json({
            message: "Successfully ApproveLeaveWorkRecord Served!",
            quick_serve_name: 'ApproveLeaveWorkRecord',
            success: true,
            data: {
                affectedRows: response.affectedRows
            }
        });
    } catch (error: any) {
        console.log('ApproveLeaveWorkRecord (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'end-work-record' });
        } else {
            HandleError(res, error, 'ApproveLeaveWorkRecord');
        }
    }
}





const OnApproveLeaveRejected = async (req: Request, res: Response): Promise<void> => {
    try {
        const empIdParam = req.params.empId;

        const baseSalary = await useSalary().getEmployeeBaseSalary(empIdParam);
        console.log('OnApproveLeaveRejected (baseSalary) : ', baseSalary);

        const deductionAmount = useDeduction().deductionCounter(baseSalary, "absent");
        console.log('OnApproveLeaveRejected (deductionAmount) : ', deductionAmount);

        const bodyDataToPreset = {
            emp_id: parseInt(empIdParam),
            deduction_type: "absent",
            amount: deductionAmount,
            note: "Work record `Leave` has rejected."
        }

        const response = await useDeduction().addNewOne(bodyDataToPreset);
        console.log('ApproveLeaveWorkRecord (response) : ', response);
    } catch (error: any) {
        console.log('OnApproveLeaveRejected (Error):', error);
        throw error;
    }
}






/**
 * Handles errors for the ApproveLeaveWorkRecord controller.
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

    if (error?.code === "WARN_DATA_TRUNCATED" && error?.sqlState === "01000") {
        return res.status(404).json({
            message: "Unknown the approve state!",
            read_me: "Please check the approve state. It must be `considering`, `approved` or `rejected`",
            quick_serve_name,
            success: false
        });
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
}