import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { CreateSalaryHistory } from "../models/resetSalary.model";
import { isString } from "@SRC/Helper/Utils";


export const createSalaryRequestPreset = (bodyData: CreateSalaryHistory): IMyRequestData => {
    const { emp_id, base_salary, ot_payments, deductions, salary_month } = bodyData;

    const calculatedNetSalary = base_salary + ot_payments - deductions;

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "salary",
        set: {
            emp_id,
            base_salary,
            ot_payments,
            deductions,
            salary_month,
            net_salary: calculatedNetSalary
        }
    };

    return preset;
}