import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import StoreService from "@SRC/Store/services";
import useSalary from "./useSalary";
import { DeductionMapperType, DeductionType } from "../models/deduction.model";

function useDeduction() {
    const addNewOne = async (bodyData: any) => {
        try {
            const payload: IMyRequestData = {
                db_type: "mysql",
                store_code: "deductions",
                set: {
                    salary_month: useSalary().getSalaryMonthDate(),
                    ...bodyData
                }
            }

            const response = await StoreService(payload, 'create');
            console.log('CreateDeduction (response) : ', response);

            return response;
        } catch (error) {
            throw error;
        }
    }

    const percentMapper: DeductionType = {
        "late": 0.03,
        "late_x3": 0.5,
        "half_day": 0.5,
        "absent": 1.0
    }

    const validDeductionTypes: DeductionMapperType[] = ["late", "late_x3", "half_day", "absent"];

    const deductionCounter = (baseSalary: number, deductionType: DeductionMapperType): number => {
        const percent: number = percentMapper[deductionType];

        const salaryPerDay = baseSalary / 20;
        const calculated = salaryPerDay * percent;

        return calculated;
    }


    return {
        addNewOne,
        deductionCounter,
        validDeductionTypes,
        percentMapper
    }
}

export default useDeduction;