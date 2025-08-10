

export type CreateEmployeeHolidaysType = {
    emp_id: number,
    holiday_id: number,
    holiday_date: string,
    reason?: string,
    approved_by: number
}