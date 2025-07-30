import { IMyRequestData } from "@SRC/Helper/Model/global.model"
import { isString } from "@SRC/Helper/Utils"
import { ApproveLeaveWorkRecordType } from "@SRC/QuickServe/models/workRecord.model"



const mysqlDate = new Date().toISOString().slice(0, 10)

export const approveLeaveWorkRecordPreset = (empId: number | string, bodyData: ApproveLeaveWorkRecordType): IMyRequestData => {
    if (isString(empId))
        empId = parseInt(empId);

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "work_record",
        where: {
            emp_id: empId,
            work_record_date: mysqlDate,
            work_record_state: "leave",
            approve_state: "considering"
        },
        set: bodyData
    }

    return preset
}



export const approveRejectedWorkRecordPreset = (bodyData: ApproveLeaveWorkRecordType): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "deductions",
        set: bodyData
    }

    return preset
}