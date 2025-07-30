import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { CreateEmployee } from "@SRC/QuickServe/models/employee/employee.model";

/**
 * Generates a request preset to create a new employee record.
 *
 * - Accepts an object conforming to the `CreateEmployee` model.
 * - Returns a structured query preset for inserting data into the `employees` table.
 *
 * @param {CreateEmployee} setData - The data to insert for the new employee.
 * @returns {IMyRequestData} - A query preset object for creating an employee.
 */
export const createOneEmployeeRequestPreset = (setData: CreateEmployee): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "employees",
        set: setData
    };

    return preset;
};
