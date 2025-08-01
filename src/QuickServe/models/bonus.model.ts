// export type BonusMapperType = "late" | "late_x3" | "half_day" | "absent";

// export type BonusType = {
//     late: number,
//     late_x3: number,
//     half_day: number,
//     absent: number
// };

export type AddBonusType = {
    emp_id: number,
    base_salary: number,
    bonus_type: string,
    note: string
}

export type UpdateBonusType = {
    emp_id?: number,
    salary_month?: string,
    amount?: number,
    bonus_type?: string,
    note?: string
}