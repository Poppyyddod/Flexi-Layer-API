import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { PersonSalaryCounterRequestPreset, SalaryCounterRequestPreset } from "../../presets/salaryCounter.preset";
import useSalaryCounter from "../../composables/useSalaryCounter";

/**
 * Handles the API endpoint to get salary summary of all employees.
 *
 * - Fetches raw salary-related data using a preset.
 * - Summarizes the salary using `useSalaryCounter`.
 * - Returns structured summary response or appropriate error message.
 *
 * @param {Request} req - Express request object (body not required).
 * @param {Response} res - Express response object used to send back JSON.
 * @returns {Promise<any>}
 */
export const GetAllSalaryCounter = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await StoreService(SalaryCounterRequestPreset, 'fetch');
        console.log('ServeAllSalaryCounter (response) : ', response);

        if (response.length === 0) {
            return res.status(200).json({
                message: "No row in the table!",
                quick_serve_name: 'AllSalaryCounter',
                success: false
            });
        }

        const salary = useSalaryCounter().SummarizeSalary(response);
        console.log('ServeAllSalaryCounter (salary) : ', salary);

        return res.status(200).json({
            message: "Successfully Served!",
            quick_serve_name: 'AllSalaryCounter',
            success: true,
            data: salary
        });
    } catch (error) {
        console.log("ServeAllSalaryCounter (Error) : ", error);

        res.status(500).json({
            message: "Failed to Serve!",
            quick_serve_name: 'AllSalaryCounter',
            success: false
        });
    }
};

/**
 * Handles the API endpoint to get salary summary of a specific employee.
 *
 * - Requires `empId` as a route parameter.
 * - Fetches salary-related data for that specific employee using a preset.
 * - Summarizes the salary using `useSalaryCounter`.
 * - Returns structured response or error message if employee not found or error occurred.
 *
 * @param {Request} req - Express request object with `empId` param.
 * @param {Response} res - Express response object used to return the result.
 * @returns {Promise<any>}
 */
export const GetOneSalaryCounter = async (req: Request, res: Response): Promise<any> => {
    try {
        const empId = req.params.empId;
        if (!empId) {
            return res.status(400).json({
                message: "Param empId is required",
                quick_serve_name: 'PersonSalaryCounter',
                success: false
            });
        }

        const requestPreset = PersonSalaryCounterRequestPreset(empId);
        const response = await StoreService(requestPreset, 'fetch');
        console.log('ServePersonSalaryCounter (response) : ', response);

        const salary = useSalaryCounter().SummarizeSalary(response);
        console.log('ServePersonSalaryCounter (salary) : ', salary);

        res.status(200).json({
            message: "Successfully Served!",
            quick_serve_name: 'PersonSalaryCounter',
            success: true,
            data: salary
        });
    } catch (error: any) {
        console.log("ServePersonSalaryCounter (Error) : ", error);

        if (error?.kind) {
            HandleError(res, error);
        } else {
            res.status(500).json({
                message: "Failed to Serve!",
                quick_serve_name: 'PersonSalaryCounter',
                success: false
            });
        }
    }
};

/**
 * Handles known or unknown errors for `GetOneSalaryCounter`.
 *
 * @param {Response} res - Express response object used to send back error response.
 * @param {any} error - The error object, which may contain a `kind` to specify type.
 * @returns {Response} - Sends an appropriate HTTP error response.
 */
const HandleError = (res: Response, error: any): Response => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown employees id!",
            quick_serve_name: 'PersonSalaryCounter',
            success: false
        });
    }

    return res.status(500).json({
        message: "Failed to Serve!",
        quick_serve_name: 'PersonSalaryCounter',
        success: false
    });
};
