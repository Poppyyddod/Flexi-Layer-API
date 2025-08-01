export type DeductionMapperType = "late" | "late_x3" | "half_day" | "absent";

export type DeductionType = {
    late: number,
    late_x3: number,
    half_day: number,
    absent: number
};

export type AddDeductionType = {
    emp_id: number,
    base_salary: number,
    deduction_type: DeductionMapperType,
    note: string
}

export type UpdateDeductionType = {
    emp_id?: number,
    salary_month?: string,
    amount?: number,
    deduction_type?: DeductionMapperType,
    note?: string
}