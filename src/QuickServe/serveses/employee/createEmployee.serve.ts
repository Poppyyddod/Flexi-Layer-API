import errorHandles from "@SRC/Helper/Data/Error";
import { CreateEmployeeImage } from "@SRC/QuickServe/models/employee.model";
import { createOneEmployeeImageRequestPreset, createOneEmployeeRequestPreset } from "@SRC/QuickServe/presets/employee/createEmployee.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";

/**
 * Validates the required fields in the Create Employee request body.
 *
 * @param {Request} req - The Express request object containing the employee data in the body.
 * @param {Response} res - The Express response object.
 * @returns {boolean} - Returns `true` if all required fields are present, otherwise `false`.
 */
const ValidateCreateOneEmployee = (req: Request, res: Response): boolean => {
    const { user_id, emp_name, emp_department_id, emp_position_id, emp_img, emp_email, emp_gender, emp_religion, emp_tel, emp_birth_date } = req.body;

    if (!user_id || !emp_name || !emp_department_id || !emp_position_id || !emp_img || !emp_email || !emp_gender || !emp_religion || !emp_tel || !emp_birth_date) return false;

    return true;
};

/**
 * Handles the logic to create a new employee.
 * This includes validation, preset generation, and database service call.
 *
 * @param {Request} req - The Express request object with employee creation data.
 * @param {Response} res - The Express response object.
 * @returns {Promise<any>} - The JSON response indicating success or failure.
 */
export const CreateOneEmployee = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('CreateEmployee : ', req.body);

        const shouldContinue = ValidateCreateOneEmployee(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'CreateOneEmployee',
                guide: {
                    user_id: "number",
                    emp_name: "string",
                    emp_department_id: "number",
                    emp_position_id: "number",
                    emp_bank_account: "string",
                    emp_img: "string",
                    emp_email: "string",
                    emp_gender: "string",
                    emp_religion: "string",
                    emp_tel: "string",
                    emp_birth_date: "string",
                },
                success: false
            });
        }

        const preset = createOneEmployeeRequestPreset(req.body);
        const response = await StoreService(preset, 'create');
        console.log('CreateEmployee (response) : ', response);

        const imagePayload: CreateEmployeeImage = {
            emp_id: response[0].emp_id,
            image_name: response[0].emp_img
        }

        const imageResponse = await CreateOneEmployeeImage(imagePayload);
        console.log('CreateOneEmployeeImage (response) : ', imageResponse);

        res.status(200).json({
            message: "Successfully CreateOneEmployee Served!",
            quick_serve_name: 'CreateOneEmployee',
            success: true,
            data: response
        });
    } catch (error: any) {
        console.log('CreateEmployee (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'create-one-employee' });
        } else {
            HandleError(res, error, 'CreateEmployee');
        }
    }
};



const CreateOneEmployeeImage = async (setData: CreateEmployeeImage): Promise<any> => {
    try {
        console.log("CreateOneEmployeeImage : ", setData);

        const response = await StoreService(createOneEmployeeImageRequestPreset(setData), 'create');
        console.log("CreateOneEmployeeImage (response) : ", response);

        return response;
    } catch (error: any) {
        console.log("CreateOneEmployeeImage (Error):", error);
        throw error;
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
};
