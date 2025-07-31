import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import { StartWorkRecordType } from "@SRC/QuickServe/models/workRecord.model";

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