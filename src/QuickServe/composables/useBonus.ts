import StoreService from "@SRC/Store/services";
import { AddBonusType } from "../models/bonus.model";
import useSalary from "./useSalary";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";


function useBonus() {
    const addNewOne = async (bodyData: any) => {
        try {
            const payload: IMyRequestData = {
                db_type: "mysql",
                store_code: "bonuses",
                set: {
                    salary_month: useSalary().getSalaryMonthDate(),
                    ...bodyData
                }
            }

            const response = await StoreService(payload, 'create');
            console.log('AddBonus (response) : ', response);

            return response;
        } catch (error) {
            throw error;
        }
    }

    return {
        addNewOne
    }
}

export default useBonus;