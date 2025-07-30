/**
 * Represents a single row of salary data for an employee.
 *
 * @typedef {object} SalaryCounterRow
 * @property {number} emp_id - The unique identifier of the employee.
 * @property {string} emp_name - The full name of the employee.
 * @property {string} position_name - The name of the employee's position.
 * @property {number} position_salary - The base salary amount for the position.
 * @property {number|null} bonus_amount - The bonus amount the employee receives, or null if none.
 * @property {number|null} deduction_amount - The deduction amount applied to the employee's salary, or null if none.
 */
export type SalaryCounterRow = {
    emp_id: number;
    emp_name: string;
    position_name: string;
    position_salary: number;
    bonus_amount: number | null;
    deduction_amount: number | null;
};
