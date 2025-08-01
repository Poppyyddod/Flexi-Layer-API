import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { AddDepartmentType } from "@SRC/QuickServe/models/department.model";

export const createDepartmentRequestPreset = (bodyData: AddDepartmentType): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "departments",
        set: bodyData
    };

    return preset;
}