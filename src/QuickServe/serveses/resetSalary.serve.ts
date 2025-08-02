import errorHandles from "@SRC/Helper/Data/Error";
import { isString } from "@SRC/Helper/Utils";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { createSalaryRequestPreset } from "../presets/resetSalary.preset";
import { CreateSalaryHistory } from "../models/resetSalary.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";





const DeleteEmployeeWorkRecord = async (empId: number) => {
    try {
        console.log('DeleteEmployeeWorkRecord -> Started!');

        const payload: IMyRequestData = {
            db_type: "mysql",
            store_code: "work_record",
            where: {
                emp_id: empId
            }
        }

        await StoreService(payload, 'delete');

        console.log('DeleteEmployeeWorkRecord -> Completed!');
    } catch (error: any) {
        if (error?.kind === "not_found_data") {
            console.log('[Error][Not Matter] Data not found!');
        } else {
            throw error;
        }
    }
}

const DeleteEmployeeBonus = async (empId: number) => {
    try {
        console.log('DeleteEmployeeBonus -> Started!');

        const payload: IMyRequestData = {
            db_type: "mysql",
            store_code: "bonuses",
            where: {
                emp_id: empId
            }
        }

        await StoreService(payload, 'delete');

        console.log('DeleteEmployeeBonus -> Completed!');
    } catch (error: any) {
        if (error?.kind === "not_found_data") {
            console.log('[Error][Not Matter] Data not found!');
        } else {
            throw error;
        }
    }
}

const DeleteEmployeeDeduction = async (empId: number) => {
    try {
        console.log('DeleteEmployeeDeduction -> Started!');

        const payload: IMyRequestData = {
            db_type: "mysql",
            store_code: "deductions",
            where: {
                emp_id: empId
            }
        }

        await StoreService(payload, 'delete');

        console.log('DeleteEmployeeDeduction -> Completed!');
    } catch (error: any) {
        if (error?.kind === "not_found_data") {
            console.log('[Error][Not Matter] Data not found!');
        } else {
            throw error;
        }
    }
}


const ValidatePayOneSalary = (req: Request, res: Response): boolean => {
    const bodyData = req.body as CreateSalaryHistory;

    if (bodyData.emp_id === undefined || bodyData.emp_id === null) return false;
    if (bodyData.base_salary === undefined || bodyData.base_salary === null) return false;
    // if (bodyData.bonus === undefined || bodyData.bonus === null) return false;
    // if (bodyData.allowance === undefined || bodyData.allowance === null) return false;
    if (bodyData.ot_payments === undefined || bodyData.ot_payments === null) return false;
    if (bodyData.deductions === undefined || bodyData.deductions === null) return false;
    if (!bodyData.salary_month) return false;
    if (!bodyData.reset === undefined || bodyData.reset === null) return false;

    return true;
};


export const PayOneSalary = async (req: Request, res: Response) => {
    try {
        console.log('PayOneSalary : ', req.body);

        const bodyData = req.body as CreateSalaryHistory;
        const shouldContinue = ValidatePayOneSalary(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'PayOneSalary',
                guide: {
                    emp_id: "number",
                    base_salary: "number",
                    ot_payment: "number",
                    deduction: "number",
                    salary_month: "string",
                    reset: "boolean"
                },
                success: false
            });
        }

        const response = await StoreService(createSalaryRequestPreset(bodyData), 'create');
        console.log('PayOneSalary (response) : ', response);

        if (response && bodyData.reset) {
            console.log('PayOneSalary Passed (response) -> Deleting The Month Data!');

            await DeleteEmployeeBonus(bodyData.emp_id);
            await DeleteEmployeeDeduction(bodyData.emp_id);
            await DeleteEmployeeWorkRecord(bodyData.emp_id);
        }

        return res.status(201).json({
            message: "Successfully PayOneSalary Served!",
            quick_serve_name: 'PayOneSalary',
            success: true,
            data: response
        })
    } catch (error: any) {
        console.log('PayOneSalary (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'PayOneSalary' });
        } else {
            HandleError(res, error, 'PayOneSalary');
        }
    }
}


const HandleError = (res: Response, error: any, quickServerName: string) => {
    if (error?.code === "ER_NO_REFERENCED_ROW_2") {
        return NoReferenceRow2(error, res, quickServerName);
    }

    return res.status(500).json({
        message: "Failed to Serve!",
        quick_server_name: quickServerName,
        success: false
    });
}


const NoReferenceRow2 = (error: any, res: Response, quickServerName: string) => {
    const match = error?.sqlMessage?.match(/CONSTRAINT `(.*?)` FOREIGN KEY \(`(.*?)`\) REFERENCES `(.*?)` \(`(.*?)`\)/);
    const field = match ? match[2] : "unknown_field";
    const table = match ? match[3] : "unknown_table";
    const referencedField = match ? match[4] : "unknown_column";

    return res.status(404).json({
        message: "Invalid foreign key reference",
        read_me: "The data you are trying to link (foreign key) doesn't exist in the referenced table.",
        detail: `Field '${field}' in this request does not match any existing '${referencedField}' in the '${table}' table.`,
        quick_server_name: quickServerName,
        success: false
    });
}