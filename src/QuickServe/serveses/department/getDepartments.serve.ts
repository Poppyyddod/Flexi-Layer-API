import { getAllDepartmentRequestPreset, getOneDepartmentRequestPreset } from "@SRC/QuickServe/presets/department.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";


/**
 * Handles the API request to retrieve one department by its ID.
 *
 * - Expects a route parameter `depId`.
 * - Fetches department data using `getOneDepartmentRequestPreset`.
 * - Returns the department data in the response if found.
 *
 * @param {Request} req - Express request object, expects `depId` in route params.
 * @param {Response} res - Express response object for sending the result.
 * @returns {Promise<any>} - JSON response containing department data or error message.
 */
export const GetOneDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOneDepartment : ', req.body);

        const departmentId = req.params.depId;
        if (!departmentId) {
            return res.status(400).json({
                message: "Param departmentId is required",
                quick_serve_name: 'GetOneDepartment',
                success: false
            });
        }

        const response = await StoreService(getOneDepartmentRequestPreset(departmentId), 'fetch');
        console.log('GetOneDepartment (response) : ', response);

        res.status(200).json({
            message: "Successfully GetOneDepartment Served!",
            quick_serve_name: 'GetOneDepartment',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOneDepartment (Error):', error);
        HandleError(res, error, 'GetOneDepartment');
    }
};

/**
 * Handles the API request to retrieve all departments.
 *
 * - Uses `getAllDepartmentRequestPreset` to prepare the query.
 * - Fetches all department records from the database.
 * - Returns a list of departments, or an empty table message.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<any>} - JSON response with department list or error message.
 */
export const GetAllDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllDepartment : ', req.body);

        const response = await StoreService(getAllDepartmentRequestPreset(), 'fetch');
        console.log('GetAllDepartment (response) : ', response);

        if (response.length === 0) {
            return res.status(200).json({
                message: "No row in the table!",
                quick_serve_name: 'GetAllDepartment',
                success: false
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllDepartment Served!",
            quick_serve_name: 'GetAllDepartment',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllDepartment (Error):', error);
        HandleError(res, error, 'GetAllDepartment');
    }
};

/**
 * Handles known and unknown errors for department-related requests.
 *
 * - If the error is of kind `not_found_data`, returns 404 with a specific message.
 * - Otherwise, returns 500 with a general failure message.
 *
 * @param {Response} res - Express response object.
 * @param {any} error - The error object thrown during the request.
 * @param {string} quick_serve_name - The name of the current quick serve feature.
 * @returns {Response} - The formatted HTTP error response.
 */
const HandleError = (res: Response, error: any, quick_serve_name: string): Response => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown department id!",
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
