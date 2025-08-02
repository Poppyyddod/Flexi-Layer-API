import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";

/**
 * Generates a request preset to retrieve an employee's full profile based on their user ID.
 *
 * - Joins `employees` with `positions` and `departments` tables.
 * - Returns detailed employee information including position and department.
 * - Accepts both string and number types for user ID and auto-converts string to number.
 *
 * @param {number | string} userId - The user ID used to identify the employee.
 * @returns {IMyRequestData} - A structured query preset for fetching the employee profile.
 */
export const getMeEmployeeRequestPreset = (userId: number | string): IMyRequestData => {
    if (isString(userId)) {
        userId = parseInt(userId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "employees",
        field_list: [
            "employees.emp_id", "employees.user_id", "employees.emp_name", "employees.emp_bank_account", "employees.emp_img", "employees.emp_email",
            "employees.emp_gender", "employees.emp_religion", "employees.emp_tel", "employees.emp_birth_date",
            "positions.position_name", "positions.position_salary",
            "departments.department_name", "departments.department_code"
        ],
        join: [
            {
                table: "positions",
                type: "left",
                on: {
                    "employees.emp_position_id": "positions.position_id"
                }
            },
            {
                table: "departments",
                type: "left",
                on: {
                    "employees.emp_department_id": "departments.department_id"
                }
            }
        ],
        where: {
            "employees.user_id": userId
        }
    };

    return preset;
};



export const getAllUserIdAndUsernameRequestPreset = (): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "user_auth",
        where: {
            user_role_id: 1
        },
        field_list: ["user_id", "user_name"]
    }

    return preset;
}
