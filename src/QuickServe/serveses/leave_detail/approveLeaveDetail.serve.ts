import errorHandles from "@SRC/Helper/Data/Error";
import useDeduction from "@SRC/QuickServe/composables/useDeduction";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import useSalary from "@SRC/QuickServe/composables/useSalary";
import { ApproveLeaveDetailType } from "@SRC/QuickServe/models/workRecord.model";
import { approveLeaveDetailPreset, approveRejectedPreset } from "@SRC/QuickServe/presets/leave_detail/approveLeaveDetail.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";


/**
 * Validates the request body and route parameter for ApproveLeaveDetail.
 *
 * @param {Request} req - Express request object containing the request body and route parameter.
 * @returns {boolean} - Returns `true` if all required fields are present, otherwise `false`.
 */
const ValidateApproveLeaveDetail = (req: Request): boolean => {
    const { leave_detail_id, leave_state } = req.body as ApproveLeaveDetailType;

    if (!leave_state || !leave_detail_id)
        return false;

    const empId = req.params.empId;
    if (!empId) return false;

    return true;
}


const mysqlDatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

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

const approveStatus = ['approved', 'pending', 'rejected'];

export const ApproveLeaveDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('ApproveLeaveDetail : ', req.body);

        const shouldContinue = ValidateApproveLeaveDetail(req);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'ApproveLeaveDetail',
                guide: {
                    leave_detail_id: "number",
                    leave_state: "pending | approved | rejected",
                },
                success: false
            });
        }

        const empIdParam = req.params.empId;
        const bodyData = req.body as ApproveLeaveDetailType

        if (!approveStatus.includes(bodyData.leave_state)) {
            return res.status(400).json({
                message: "Invalid leave state!",
                quick_serve_name: 'ApproveLeaveDetail',
                details: `Unknown '${bodyData.leave_state}' approve state.`,
                allowed: `${approveStatus.join(', ')}`,
                success: false
            });
        }

        const preset = approveLeaveDetailPreset(empIdParam, bodyData);

        const response = await StoreService(preset, 'edit');
        console.log('ApproveLeaveDetail (response) : ', response);

        if (bodyData.leave_state === "rejected") {
            await OnApproveLeaveRejected(req, res);
        }

        const currentDateTime = useTime().getLocalTimeAsISOString();

        return res.status(200).json({
            message: "Successfully ApproveLeaveDetail Served!",
            quick_serve_name: 'ApproveLeaveDetail',
            success: true,
            data: {
                affectedRows: response.affectedRows,
                updated_at: currentDateTime
            }
        });
    } catch (error: any) {
        console.log('ApproveLeaveDetail (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'approve-leave-work-record' });
        } else {
            HandleError(res, error, 'ApproveLeaveDetail');
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
        console.log('ApproveLeaveDetail (response) : ', response);
    } catch (error: any) {
        console.log('OnApproveLeaveRejected (Error):', error);
        throw error;
    }
}






/**
 * Handles errors for the ApproveLeaveDetail controller.
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
            read_me: "Please check the approve state. It must be `pending`, `approved` or `rejected`",
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