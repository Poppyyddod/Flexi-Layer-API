import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import StoreService from "@SRC/Store/services";


function useSalary() {
    const getSalaryMonthDate = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // +1 และเติม 0
        return `${year}-${month}-30`;
    };

    const getEmployeeBaseSalary = async (empId: number | string): Promise<number> => {
        try {
            console.log('getBaseSalary (empId) : ', empId);

            const payload: IMyRequestData = {
                db_type: "mysql",
                store_code: "employees",
                field_list: ["positions.position_salary"],
                join: [
                    {
                        table: "positions",
                        type: "left",
                        on: {
                            "employees.emp_position_id": "positions.position_id"
                        }
                    }
                ],
                where: {
                    "employees.emp_id": empId
                }
            };

            const response = await StoreService(payload, 'fetch');
            console.log('getBaseSalary (response) : ', response);

            const baseSalary = response[0].position_salary as number;

            return baseSalary;
        } catch (error) {
            throw error;
        }
    }

    return {
        getSalaryMonthDate,
        getEmployeeBaseSalary
    }
}

export default useSalary;