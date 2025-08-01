import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
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