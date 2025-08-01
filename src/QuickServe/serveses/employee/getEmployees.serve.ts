import { getAllEmployeesRequestPreset, getOneEmployeesRequestPreset } from "@SRC/QuickServe/presets/employee.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



/**
 * Handles the request to retrieve a single employee's data by their ID.
 *
 * @param {Request} req - Express request object. Requires `empId` in route parameters.
 * @param {Response} res - Express response object.
 *
 * @returns {Promise<Response>} JSON response containing the employee data or an error message.
 *
 * @example
 * GET /quickserve/employee/1
 */
export const GetOneEmployee = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOneEmployee : ', req.body);

        const empId = req.params.empId;
        if (!empId) {
            res.status(400).json({
                message: "Param employeeId is required",
                quick_serve_name: 'GetOneEmployee',
                success: false
            });
        }

        const response = await StoreService(getOneEmployeesRequestPreset(empId), 'fetch');
        console.log('GetOneEmployee (response) : ', response);

        res.status(200).json({
            message: "Successfully GetOneEmployee Served!",
            quick_serve_name: 'GetOneEmployee',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOneEmployee (Error):', error);
        HandleError(res, error, 'GetOneEmployee');
    }
}









/**
 * Handles the request to retrieve a list of all employees.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 *
 * @returns {Promise<Response>} JSON response containing the list of employees or an error message.
 *
 * @example
 * GET /quickserve/employee
 */
export const GetAllEmployee = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllEmployee : ', req.body);

        const response = await StoreService(getAllEmployeesRequestPreset(), 'fetch');
        console.log('GetAllEmployee (response) : ', response);

        if (response?.kind === "null_data") {
            return res.status(200).json({
                message: "No rows found!",
                quick_serve_name: 'GetAllEmployee',
                success: false
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllEmployee Served!",
            quick_serve_name: 'GetAllEmployee',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllEmployee (Error):', error);
        HandleError(res, error, 'GetAllEmployee');
    }
}




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