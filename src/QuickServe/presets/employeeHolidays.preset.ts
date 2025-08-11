import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";






export const getOneEmployeeHolidaysRequestPreset = (empId: string | number): IMyRequestData => {
    if (isString(empId)) {
        empId = parseInt(empId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "employee_holidays",
        field_list: [
            "employee_holidays.*",
            "employees.emp_name",
            "departments.department_name",
            "holidays.holiday_name",
            "holidays.holiday_start_date",
            "holidays.holiday_end_date"
        ],
        where: {
            "employee_holidays.emp_id": empId
        },
        join: [
            {
                table: "holidays",
                type: "left",
                on: {
                    "holidays.holiday_id": "employee_holidays.holiday_id"
                }
            },
            {
                table: "employees",
                type: "left",
                on: {
                    "employees.emp_id": "employee_holidays.emp_id"
                }
            },
            {
                table: "departments",
                type: "left",
                on: {
                    "departments.department_id": "employees.emp_department_id"
                }
            }
        ]
    }

    return preset;
};


export const getAllEmployeeHolidaysRequestPreset = (): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "employee_holidays",
        field_list: [
            "employee_holidays.*",
            "employees.emp_name",
            "departments.department_name",
            "holidays.holiday_name",
            "holidays.holiday_start_date",
            "holidays.holiday_end_date"
        ],
        join: [
            {
                table: "holidays",
                type: "left",
                on: {
                    "holidays.holiday_id": "employee_holidays.holiday_id"
                }
            },
            {
                table: "employees",
                type: "left",
                on: {
                    "employees.emp_id": "employee_holidays.emp_id"
                }
            },
            {
                table: "departments",
                type: "left",
                on: {
                    "departments.department_id": "employees.emp_department_id"
                }
            }
        ]
    }

    return preset;
};


export const createEmployeeHolidaysRequestPreset = (setData: any): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "employee_holidays",
        set: setData
    }

    return preset;
};