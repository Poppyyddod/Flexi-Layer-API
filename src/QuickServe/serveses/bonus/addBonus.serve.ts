import errorHandles from "@SRC/Helper/Data/Error";
import useBonus from "@SRC/QuickServe/composables/useBonus";
import { AddBonusType } from "@SRC/QuickServe/models/bonus.model";
import { Request, Response } from "express";



/**
 * Validates the required fields in the Add Bonus request body.
 *
 * @param {Request} req - The Express request object containing the bonus data in the body.
 * @param {Response} res - The Express response object.
 * @returns {boolean} - Returns `true` if all required fields are present, otherwise `false`.
 */
const ValidateAddBonus = (req: Request, res: Response): boolean => {
    const { emp_id, bonus_type, base_salary } = req.body as AddBonusType;

    if (!emp_id || !bonus_type || !base_salary) return false;

    return true;
};




/**
 * Handles the API endpoint to add a new bonus for an employee.
 *
 * - Validates the request body for necessary fields (emp_id, bonus_type, base_salary, note).
 * - Adds the bonus to the database using `useBonus().addNewOne()`.
 * - Returns a JSON response with a success message and the stored data on successful creation.
 *
 * @param {Request} req - The Express request object containing the bonus data in the body.
 * @param {Response} res - The Express response object used to send back JSON.
 * @returns {Promise<any>} - The JSON response indicating success or failure of the operation.
 */
export const AddBonus = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('AddBonus : ', req.body);

        const shouldContinue = ValidateAddBonus(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'AddBonus',
                guide: {
                    emp_id: "number",
                    bonus_type: "string",
                    base_salary: "number",
                    note: "string"
                },
                success: false
            });
        }

        const bodyData = req.body as AddBonusType;

        // In Testing
        const bonusPayload = {
            emp_id: bodyData.emp_id,
            bonus_type: bodyData.bonus_type,
            amount: 50000,
            note: bodyData.note
        }

        const response = await useBonus().addNewOne(bonusPayload);

        return res.status(201).json({
            message: "Successfully AddBonus Served!",
            quick_serve_name: 'AddBonus',
            success: true,
            data: response
        });
    } catch (error: any) {
        console.log('AddBonus (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'AddBonus' });
        } else {
            HandleError(res, error, 'AddBonus');
        }
    }
};



/**
 * Generic error handler for database-related and unknown errors.
 *
 * @param {Response} res - The Express response object.
 * @param {any} error - The caught error during execution.
 * @param {string} quick_serve_name - The identifier name of the quick serve feature.
 * @returns {Response} - The HTTP response with appropriate error message.
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
 * Handles foreign key constraint violation (ER_NO_REFERENCED_ROW_2).
 * Extracts and formats useful details for the client to understand the issue.
 * 
 * @param {any} error - The error object containing SQL constraint failure.
 * @param {Response} res - The Express response object.
 * @param {string} quick_serve_name - The identifier name of the quick serve feature.
 * @returns {Record<string, any>} - A detailed error response describing the invalid reference.
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