import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";
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
            end_at: mysqlDateTime,
            end_latitude,
            end_longitude,
            work_record_state: "ended"
        }
    };

    return preset;
}