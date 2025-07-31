import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { getAllWorkRecordRequestPreset, getOneWorkRecordRequestPreset } from "@SRC/QuickServe/presets/work_record/getWorkRecord.preset";
import useWorkRecord from "@SRC/QuickServe/composables/useWorkRecord";


/**
 * Handles the request to fetch a single work record by employee ID.
 *
 * - Validates the request body and `workRecordState` and `approveState` route parameters.
 * - Calls the `StoreService` to fetch one work record from the database.
 * - Responds with a success message and the fetched data on successful fetch.
 *
 * @param {Request} req - Express request object containing the request body and route parameters.
 * @param {Response} res - Express response object used to return the result.
 * @returns {Promise<any>} - JSON response indicating success or failure of the operation.
 */
export const GetOneWorkRecord = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOneWorkRecord : ', req.body);

        const empId = req.params.empId;
        if (!empId) {
            return res.status(400).json({
                message: "Param employeeId is required",
                quick_serve_name: 'GetOneWorkRecord',
                success: false
            });
        }

        const workRecordState = req.params.workRecordState;
        if (!useWorkRecord().paramWorkRecordStateArr.includes(workRecordState)) {
            return res.status(400).json({
                message: "Param workRecordState is required",
                details: `Unknown '${workRecordState}' workRecordState.`,
                allowed: useWorkRecord().paramWorkRecordStateArr.join(', '),
                quick_serve_name: 'GetOneWorkRecord',
                success: false
            });
        }

        const paramApproveState = req.params.approveState;
        if (!useWorkRecord().paramApproveStateArr.includes(paramApproveState)) {
            return res.status(400).json({
                message: "Param approveState is required",
                details: `Unknown '${paramApproveState}' approveState.`,
                allowed: useWorkRecord().paramApproveStateArr.join(', '),
                quick_serve_name: 'GetOneWorkRecord',
                success: false
            });
        }

        const response = await StoreService(getOneWorkRecordRequestPreset(empId, workRecordState, paramApproveState), 'fetch');
        console.log('GetOneWorkRecord (response) : ', response);

        return res.status(200).json({
            message: "Successfully GetOneWorkRecord Served!",
            quick_serve_name: 'GetOneWorkRecord',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOneWorkRecord (Error):', error);
        HandleError(res, error, 'GetOneWorkRecord');
    }
}






/**
 * Handles the request to fetch all work records.
 *
 * - Validates the request body and `workRecordState` and `approveState` route parameters.
 * - Calls the `StoreService` to fetch all work records from the database.
 * - Responds with a success message and the fetched data on successful fetch.
 *
 * @param {Request} req - Express request object containing the request body and route parameters.
 * @param {Response} res - Express response object used to return the result.
 * @returns {Promise<any>} - JSON response indicating success or failure of the operation.
 */
export const GetAllWorkRecord = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllWorkRecord : ', req.body);

        const paramWorkRecordState = req.params.workRecordState;
        if (!useWorkRecord().paramWorkRecordStateArr.includes(paramWorkRecordState)) {
            return res.status(400).json({
                message: "Param workRecordState is required",
                details: `Unknown '${paramWorkRecordState}' workRecordState.`,
                allowed: useWorkRecord().paramWorkRecordStateArr.join(', '),
                quick_serve_name: 'GetOneWorkRecord',
                success: false
            });
        }

        const paramApproveState = req.params.approveState;
        if (!useWorkRecord().paramApproveStateArr.includes(paramApproveState)) {
            return res.status(400).json({
                message: "Param approveState is required",
                details: `Unknown '${paramApproveState}' approveState.`,
                allowed: useWorkRecord().paramApproveStateArr.join(', '),
                quick_serve_name: 'GetOneWorkRecord',
                success: false
            });
        }

        const response = await StoreService(getAllWorkRecordRequestPreset(paramWorkRecordState, paramApproveState), 'fetch');
        console.log('GetAllWorkRecord (response) : ', response);

        if (response?.kind === "null_data") {
            return res.status(200).json({
                message: "No rows found!",
                quick_serve_name: 'GetOneWorkRecord',
                success: true,
                data: []
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllWorkRecord Served!",
            quick_serve_name: 'GetAllWorkRecord',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllWorkRecord (Error):', error);
        HandleError(res, error, 'GetAllWorkRecord');
    }
}







/**
 * Handles errors for work record controllers.
 *
 * - If the error is of kind `not_found_data`, returns 404 with a message indicating that the data is not found or may not exist.
 * - Otherwise, returns 500 with a general failure message.
 *
 * @param {Response} res - Express response object.
 * @param {any} error - The error object.
 * @param {string} quick_serve_name - The name of the current quick serve feature.
 * @returns {Response} - The formatted HTTP error response.
 */
const HandleError = (res: Response, error: any, quick_serve_name: string) => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Data is not found or may not exist.",
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