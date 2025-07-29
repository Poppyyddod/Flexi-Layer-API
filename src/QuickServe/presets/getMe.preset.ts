import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";



export const getMeEmployeeRequestPreset = (userId: number | string): IMyRequestData => {

    if (isString(userId)) {
        userId = parseInt(userId);
    }

    const preset: IMyRequestData = {
        "db_type": "mysql",
        "store_code": "employees",
        "field_list": [
            "employees.emp_id", "employees.user_id", "employees.emp_name", "employees.emp_email",
            "employees.emp_gender", "employees.emp_religion", "employees.emp_tel", "employees.emp_birth_date", 
            "positions.position_name", "positions.position_salary",
            "departments.department_name", "departments.department_code"
        ],
        "join": [
            {
                "table": "positions",
                "type": "left",
                "on": {
                    "employees.emp_position_id": "positions.position_id"
                }
            },
            {
                "table": "departments",
                "type": "left",
                "on": {
                    "employees.emp_department_id": "departments.department_id"
                }
            }
        ],
        "where": {
            "employees.user_id": userId
        }
    };

    return preset;
}