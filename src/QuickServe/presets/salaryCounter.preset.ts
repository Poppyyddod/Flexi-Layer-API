import { IMyRequestData } from "@SRC/Helper/Model/global.model";


export const SalaryCounterRequestPreset: IMyRequestData = {
    "db_type": "mysql",
    "store_code": "employees",
    "field_list": [
        "employees.emp_id",
        "employees.emp_name",
        "positions.position_name",
        "positions.position_salary",
        "bonuses.amount AS bonus_amount",
        "bonuses.bonus_type",
        "bonuses.salary_month AS bonus_month",
        "deductions.amount AS deduction_amount",
        "deductions.deduction_type",
        "deductions.salary_month AS deduction_month"
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
            "table": "bonuses",
            "type": "left",
            "on": {
                "employees.emp_id": "bonuses.emp_id"
            }
        },
        {
            "table": "deductions",
            "type": "left",
            "on": {
                "employees.emp_id": "deductions.emp_id"
            }
        }
    ],
}


export const PersonSalaryCounterRequestPreset = (empId: number | string): IMyRequestData => {
    const personPreset: IMyRequestData = {
        "db_type": "mysql",
        "store_code": "employees",
        "field_list": [
            "employees.emp_id",
            "employees.emp_name",
            "positions.position_name",
            "positions.position_salary",
            "bonuses.amount AS bonus_amount",
            "bonuses.bonus_type",
            "bonuses.salary_month AS bonus_month",
            "deductions.amount AS deduction_amount",
            "deductions.deduction_type",
            "deductions.salary_month AS deduction_month"
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
                "table": "bonuses",
                "type": "left",
                "on": {
                    "employees.emp_id": "bonuses.emp_id"
                }
            },
            {
                "table": "deductions",
                "type": "left",
                "on": {
                    "employees.emp_id": "deductions.emp_id"
                }
            }
        ],
        "where": {
            "employees.emp_id": empId
        }
    };

    return personPreset;
}