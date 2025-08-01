import { getAllDeductionRequestPreset, getOneDeductionRequestPreset } from "@SRC/QuickServe/presets/deduction.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";




/**
 * Handles the API request to retrieve a single bonus by its employee ID.
 *
 * - Expects a route parameter `empId`.
 * - Fetches bonus data using `getOneDeductionRequestPreset`.
 * - Returns the bonus data in the response if found.
 *
 * @param {Request} req - Express request object, expects `empId` in route params.
 * @param {Response} res - Express response object for sending the result.
 * @returns {Promise<any>} - JSON response containing bonus data or error message.
 */
export const GetOneDeduction = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOneDeduction : ', req.body);

        const empId = req.params.empId;
        if (!empId) {
            res.status(400).json({
                message: "Param employeeId is required",
                quick_serve_name: 'GetOneDeduction',
                success: false
            });
        }

        const response = await StoreService(getOneDeductionRequestPreset(empId), 'fetch');
        console.log('GetOneDeduction (response) : ', response);

        res.status(200).json({
            message: "Successfully GetOneDeduction Served!",
            quick_serve_name: 'GetOneDeduction',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOneDeduction (Error):', error);
        HandleError(res, error, 'GetOneDeduction');
    }
}










/**
 * Handles the API request to retrieve a list of all bonuses.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 *
 * @returns {Promise<Response>} JSON response containing the list of bonuses or an error message.
 *
 * @example
 * GET /quickserve/bonus
 */
export const GetAllDeduction = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllDeduction : ', req.body);

        const response = await StoreService(getAllDeductionRequestPreset(), 'fetch');
        console.log('GetAllDeduction (response) : ', response);

        if (response?.kind === "null_data") {
            return res.status(200).json({
                message: "No rows found!",
                quick_serve_name: 'GetAllDeduction',
                success: true,
                data: []
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllDeduction Served!",
            quick_serve_name: 'GetAllDeduction',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllDeduction (Error):', error);
        HandleError(res, error, 'GetAllDeduction');
    }
}




/**
 * Generic error handler for database-related and unknown errors.
 *
 * @param {Response} res - The Express response object.
 * @param {any} error - The caught error during execution.
 * @param {string} quick_serve_name - The identifier name of the quick serve feature.
 * @returns {Response} - The HTTP response with appropriate error message.
 */
const HandleError = (res: Response, error: any, quick_serve_name: string) => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown employee id!",
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