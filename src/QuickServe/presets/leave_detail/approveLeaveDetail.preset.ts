import { IMyRequestData } from "@SRC/Helper/Model/global.model"
import { isString } from "@SRC/Helper/Utils"
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