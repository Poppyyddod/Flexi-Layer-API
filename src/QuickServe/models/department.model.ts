

export type AddDepartmentType = {
    department_name: string,
    department_code: string,
    description?: string
}

export type UpdateDepartmentType = {
    department_name?: string,
    department_code?: string,
    description?: string
}