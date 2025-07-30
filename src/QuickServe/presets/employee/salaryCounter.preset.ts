import { IMyRequestData } from "@SRC/Helper/Model/global.model";

/**
 * Preset for querying all employees with their salary-related details.
 *
 * - Joins the `positions`, `bonuses`, and `deductions` tables.
 * - Retrieves employee name, position, base salary, bonuses, and deductions.
 * - Used for summarizing salary information across all employees.
 *
 * @constant
 * @type {IMyRequestData}
 */
export const SalaryCounterRequestPreset: IMyRequestData = {
    db_type: "mysql",
    store_code: "employees",
    field_list: [
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
    join: [
        {
            table: "positions",
            type: "left",
            on: {
                "employees.emp_position_id": "positions.position_id"
            }
        },
        {
            table: "bonuses",
            type: "left",
            on: {
                "employees.emp_id": "bonuses.emp_id"
            }
        },
        {
            table: "deductions",
            type: "left",
            on: {
                "employees.emp_id": "deductions.emp_id"
            }
        }
    ]
};

/**
 * Preset for querying a specific employee's salary-related details by `emp_id`.
 *
 * - Filters by employee ID.
 * - Joins the `positions`, `bonuses`, and `deductions` tables.
 * - Retrieves the employee's name, base salary, bonuses, and deductions.
 *
 * @param {number | string} empId - The ID of the employee whose salary data will be fetched.
 * @returns {IMyRequestData} - A structured query preset for fetching salary details of one employee.
 */
export const PersonSalaryCounterRequestPreset = (empId: number | string): IMyRequestData => {
    const personPreset: IMyRequestData = {
        db_type: "mysql",
        store_code: "employees",
        field_list: [
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
        join: [
            {
                table: "positions",
                type: "left",
                on: {
                    "employees.emp_position_id": "positions.position_id"
                }
            },
            {
                table: "bonuses",
                type: "left",
                on: {
                    "employees.emp_id": "bonuses.emp_id"
                }
            },
            {
                table: "deductions",
                type: "left",
                on: {
                    "employees.emp_id": "deductions.emp_id"
                }
            }
        ],
        where: {
            "employees.emp_id": empId
        }
    };

    return personPreset;
};
