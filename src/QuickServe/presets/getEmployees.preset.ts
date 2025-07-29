import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";



export const getOneEmployeesRequestPreset = (empId: string | number): IMyRequestData => {

    if (isString(empId)) {
        empId = parseInt(empId);
    }

    const preset: IMyRequestData = {
        "db_type": "mysql",
        "store_code": "employees",
        "field_list": "*",
        "where": {
            "emp_id": empId
        }
    }

    return preset;
};

export const getAllEmployeesRequestPreset = (): IMyRequestData => {
    const preset: IMyRequestData = {
        "db_type": "mysql",
        "store_code": "employees",
        "field_list": "*"
    }

    return preset;
};