import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { CreateSalaryHistory } from "../models/resetSalary.model";
import { isString } from "@SRC/Helper/Utils";


export const createSalaryHistoryRequestPreset = (bodyData: CreateSalaryHistory): IMyRequestData => {
    const { emp_id, base_salary, bonus, allowance, ot_payment, deduction, salary_month } = bodyData;

    const calculatedNetSalary = base_salary + bonus + allowance + ot_payment - deduction;

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "salary_history",
        set: {
            emp_id,
            base_salary,
            bonus,
            allowance,
            ot_payment,
            deduction,
            salary_month,
            net_salary: calculatedNetSalary
        }
    };

    return preset;
}