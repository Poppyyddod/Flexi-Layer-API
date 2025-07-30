import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";
import { LeaveWorkRecordType } from "@SRC/QuickServe/models/workRecord.model";


const now = new Date();
const mysqlDate = now.toISOString().slice(0, 10);
const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

/**
 * Generates a request preset to create a leave work record.
 *
 * - Accepts an object conforming to the `LeaveWorkRecordType` model.
 * - Inserts `emp_id`, `start_latitude`, and `start_longitude` into the `work_record` table.
 * - Sets `work_record_date` to the current date and `start_at` to the current datetime.
 * - Sets `work_record_state` to `'leave'`.
 *
 * @param {LeaveWorkRecordType} bodyData - The data to insert for the leave work record.
 * @returns {IMyRequestData} - A query preset object for creating a leave work record.
 */

export const leaveWorkRecordRequestPreset = (bodyData: LeaveWorkRecordType): IMyRequestData => {
    const { emp_id, start_latitude, start_longitude } = bodyData;

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "work_record",
        set: {
            emp_id,
            work_record_date: mysqlDate,
            start_at: mysqlDateTime,
            start_latitude,
            start_longitude,
            work_record_state: 'leave',
            approve_state: 'considering'
        }
    };

    return preset;
}