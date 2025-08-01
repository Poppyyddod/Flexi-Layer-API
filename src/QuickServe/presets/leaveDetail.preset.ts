

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
export const getOneLeaveDetailRequestPreset = (empId: string | number, leaveState: string): IMyRequestData => {
    if (isString(empId)) {
        empId = parseInt(empId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "leave_details",
        field_list: "*",
        where: {
            emp_id: empId,
            leave_state: leaveState
        }
    };

    if (leaveState === 'nofilter') {
        delete preset['where'].leave_state;
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
export const getAllLeaveDetailRequestPreset = (leaveState: string): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "leave_details",
        field_list: "*",
        where: {
            leave_state: leaveState
        }
    };

    if (leaveState === 'nofilter') {
        delete preset['where'];
    }

    return preset;
};



import { CreateLeaveDetailType } from "@SRC/QuickServe/models/workRecord.model";



/**
 * Generates a request preset to create a leave work record.
 *
 * - Accepts an object conforming to the `CreateLeaveDetailType` model.
 * - Inserts `emp_id`, `start_latitude`, and `start_longitude` into the `work_record` table.
 * - Sets `work_record_date` to the current date and `start_at` to the current datetime.
 * - Sets `work_record_state` to `'leave'`.
 *
 * @param {CreateLeaveDetailType} bodyData - The data to insert for the leave work record.
 * @returns {IMyRequestData} - A query preset object for creating a leave work record.
 */

export const createLeaveDetailRequestPreset = (bodyData: CreateLeaveDetailType): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "leave_details",
        set: bodyData
    };

    return preset;
}




import { ApproveLeaveDetailType } from "@SRC/QuickServe/models/workRecord.model"



const mysqlDate = new Date().toISOString().slice(0, 10)

export const approveLeaveDetailPreset = (empId: number | string, bodyData: ApproveLeaveDetailType): IMyRequestData => {
    if (isString(empId))
        empId = parseInt(empId);

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "leave_details",
        where: {
            emp_id: empId,
            leave_detail_id: bodyData.leave_detail_id
        },
        set: bodyData
    }

    return preset
}



export const approveRejectedPreset = (bodyData: ApproveLeaveDetailType): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "deductions",
        set: bodyData
    }

    return preset
}