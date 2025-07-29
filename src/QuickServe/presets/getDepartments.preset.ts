import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";


export const getOneDepartmentRequestPreset = (departmentId: number | string) => {

    if (isString(departmentId)) {
        departmentId = parseInt(departmentId);
    }

    const preset: IMyRequestData = {
        "db_type": "mysql",
        "store_code": "departments",
        "field_list": "*",
        "where": {
            "department_id": departmentId
        }
    }

    return preset;
}

export const getAllDepartmentRequestPreset = () => {
    const preset: IMyRequestData = {
        "db_type": "mysql",
        "store_code": "departments",
        "field_list": "*"
    }

    return preset;
}