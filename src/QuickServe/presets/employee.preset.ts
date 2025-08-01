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
export const getOneEmployeesRequestPreset = (empId: string | number): IMyRequestData => {
    if (isString(empId)) {
        empId = parseInt(empId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "employees",
        field_list: "*",
        where: {
            emp_id: empId
        }
    };

    return preset;
};

/**
 * Generates a request preset to fetch all employees.
 *
 * - Does not include any filter conditions.
 * - Returns all fields from the `employees` table.
 *
 * @returns {IMyRequestData} - A query preset object for fetching all employees.
 */
export const getAllEmployeesRequestPreset = (): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "employees",
        field_list: "*"
    };

    return preset;
};




import { CreateEmployee, CreateEmployeeImage } from "@SRC/QuickServe/models/employee.model";

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


export const createOneEmployeeImageRequestPreset = (setData: CreateEmployeeImage): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "image_details",
        set: setData
    }

    return preset;
};
