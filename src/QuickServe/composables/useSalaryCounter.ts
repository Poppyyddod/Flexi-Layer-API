import { SalaryCounterRow } from "../models/salaryCounter.model";


function useSalaryCounter() {
    const SummarizeSalary = (rows: SalaryCounterRow[]) => {
        const grouped = new Map<number, {
            emp_id: number;
            emp_name: string;
            position: string;
            base_salary: number;
            total_bonus: number;
            total_deduction: number;
        }>();

        for (const row of rows) {
            if (!grouped.has(row.emp_id)) {
                grouped.set(row.emp_id, {
                    emp_id: row.emp_id,
                    emp_name: row.emp_name,
                    position: row.position_name,
                    base_salary: row.position_salary,
                    total_bonus: 0,
                    total_deduction: 0
                });
            }

            const entry = grouped.get(row.emp_id)!;
            entry.total_bonus += row.bonus_amount || 0;
            entry.total_deduction += row.deduction_amount || 0;
        }

        // เพิ่ม field net salary
        return [...grouped.values()].map(e => ({
            ...e,
            net_salary: e.base_salary + e.total_bonus - e.total_deduction
        }));
    }

    return {
        SummarizeSalary
    }
}

export default useSalaryCounter;