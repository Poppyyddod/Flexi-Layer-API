import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";

/**
 * Generates a request preset to fetch a single employee by their ID.
 *
 * - Converts the employee ID to a number if provided as a string.
 * - Returns a query preset with a `where` clause targeting `emp_id`.
 *
 * @param {string | number} empId - The ID of the employee to retrieve.
 * @returns {IMyRequestData} - A query preset object for fetching one employee.
 */
export const getOneDeductionRequestPreset = (empId: string | number): IMyRequestData => {
    if (isString(empId)) {
        empId = parseInt(empId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "deductions",
        field_list: "*",
        where: {
            emp_id: empId
        }
    };

    return preset;
};

/**
 * Generates a request preset to fetch all deductions.
 *
 * - Does not include any filter conditions.
 * - Returns all fields from the `deductions` table.
 *
 * @returns {IMyRequestData} - A query preset object for fetching all deductions.
 */
export const getAllDeductionRequestPreset = (): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "deductions",
        field_list: "*"
    };

    return preset;
};
