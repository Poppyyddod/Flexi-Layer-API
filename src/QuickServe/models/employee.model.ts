/**
 * Represents the data required to create a new employee record.
 *
 * @typedef {object} CreateEmployee
 * @property {number} emp_id - The unique identifier for the employee.
 * @property {string} emp_name - The full name of the employee.
 * @property {string} emp_email - The email address of the employee.
 * @property {string} emp_gender - The gender of the employee.
 * @property {string} emp_religion - The religion of the employee.
 * @property {string} emp_tel - The telephone number of the employee.
 * @property {string} emp_birth_date - The birth date of the employee in string format (e.g., YYYY-MM-DD).
 * @property {number} emp_position_id - The ID referencing the employee’s position.
 * @property {number} emp_department_id - The ID referencing the employee’s department.
 */
export type CreateEmployee = {
    emp_name: string;
    emp_position_id: number;
    emp_department_id: number;
    emp_bank_account: string;
    emp_img: string;
    emp_email: string;
    emp_gender: string;
    emp_religion: string;
    emp_tel: string;
    emp_birth_date: string;
};


export type CreateEmployeeImage = {
    emp_id: number;
    image_name: string;
}

export type UpdateEmployeeType = {
    emp_name: string;
    emp_position_id: number;
    emp_department_id: number;
    emp_bank_account: string;
    emp_img: string;
    emp_email: string;
    emp_gender: string;
    emp_religion: string;
    emp_tel: string;
    emp_birth_date: string;
}