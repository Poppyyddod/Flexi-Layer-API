import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import { StartWorkRecordType } from "@SRC/QuickServe/models/workRecord.model";



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



/**
 * Generates a request preset to create a new work record.
 *
 * - Accepts an object conforming to the `StartWorkRecordType` model.
 * - Returns a structured query preset for inserting data into the `work_record` table.
 * - Sets `work_record_state` to `'working'` and `work_record_date` to the current date.
 *
 * @param {StartWorkRecordType} setData - The data to insert for the new work record.
 * @returns {IMyRequestData} - A query preset object for creating a work record.
 */
export const startWorkRecordRequestPreset = (setData: StartWorkRecordType): IMyRequestData => {

    const currentMySQlDateTime = useTime().getLocalMysqlDatetime();
    setData.start_at = currentMySQlDateTime;

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "work_record",
        set: {
            ...setData,
            work_record_date: useTime().mysqlDate,
            work_record_state: "working",
            approve_state: "approved"
        }
    };

    return preset;
};



import { EndWorkRecordType } from "@SRC/QuickServe/models/workRecord.model";



const now = new Date();
const mysqlDate = now.toISOString().slice(0, 10);
const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');


/**
 * Generates a request preset to update an existing work record's end details.
 *
 * - Updates the `end_at`, `end_latitude`, and `end_longitude` fields in the work record.
 * - Updates the `work_record_state` to `'ended'`.
 * - Accepts both string and number types for `empId` and auto-converts string to number.
 *
 * @param {number | string} empId - The ID of the employee whose work record will be updated.
 * @param {EndWorkRecordType} bodyData - The data to update for the end work record.
 * @returns {IMyRequestData} - A query preset object for updating a work record.
 */
export const endWorkRecordRequestPreset = (empId: number | string, bodyData: EndWorkRecordType): IMyRequestData => {
    const { end_latitude, end_longitude } = bodyData;

    if (isString(empId))
        empId = parseInt(empId);

    const preset: IMyRequestData = {
        db_type: 'mysql',
        store_code: 'work_record',
        where: {
            emp_id: empId,
            work_record_date: mysqlDate,

            work_record_state: 'working'
        },
        set: {
            end_at: useTime().getLocalMysqlDatetime(),
            end_latitude,
            end_longitude,
            work_record_state: "ended"
        }
    };

    return preset;
}



export const deleteOneWorkRecordRequestPreset = (workId: string | number): IMyRequestData => {
    if (isString(workId)) {
        workId = parseInt(workId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "work_record",
        where: {
            work_record_id: workId
        }
    };

    return preset;
};