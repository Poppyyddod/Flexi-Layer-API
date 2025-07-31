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
export const getOneWorkRecordRequestPreset = (empId: string | number, workRecordState: string, approveState: string): IMyRequestData => {
    if (isString(empId)) {
        empId = parseInt(empId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "work_record",
        field_list: "*",
        where: {
            emp_id: empId,
            work_record_state: workRecordState,
            approve_state: approveState
        }
    };

    if (workRecordState === 'nofilter') {
        delete preset['where'].work_record_state;
    }

    if (approveState === 'nofilter') {
        delete preset['where'].approve_state;
    }

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
export const getAllWorkRecordRequestPreset = (workRecordState: string, approveState: string): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "work_record",
        field_list: "*",
        where: {
            work_record_state: workRecordState,
            approve_state: approveState
        }
    };

    if (workRecordState === 'nofilter') {
        delete preset['where'].work_record_state;
    }

    if (approveState === 'nofilter') {
        delete preset['where'].approve_state;
    }

    if (workRecordState === 'nofilter' && approveState === 'nofilter') {
        delete preset['where'];
    }

    return preset;
};
