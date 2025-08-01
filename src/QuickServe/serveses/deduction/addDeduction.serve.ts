import errorHandles from "@SRC/Helper/Data/Error";
import useDeduction from "@SRC/QuickServe/composables/useDeduction";
import { AddDeductionType } from "@SRC/QuickServe/models/deduction.model";
import { Request, Response } from "express";



const ValidateAddDeduction = (req: Request, res: Response): boolean => {
    const { emp_id, deduction_type, base_salary } = req.body as AddDeductionType;

    if (!emp_id || !deduction_type || !base_salary) return false;

    return true;
};




export const AddDeduction = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('AddDeduction : ', req.body);

        const shouldContinue = ValidateAddDeduction(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'AddDeduction',
                guide: {
                    emp_id: "number",
                    deduction_type: "string",
                    base_salary: "number",
                    note: "string"
                },
                success: false
            });
        }

        const bodyData = req.body as AddDeductionType;
        // const preset = addDeductionRequestPreset(bodyData);

        const isValidDeductionType = useDeduction().validDeductionTypes.includes(bodyData.deduction_type);

        if (!isValidDeductionType) {
            return res.status(400).json({
                message: "Invalid deduction type!",
                quick_serve_name: 'AddDeduction',
                details: `Unknown '${bodyData.deduction_type}' deduction type.`,
                allowed: `${useDeduction().validDeductionTypes.join(', ')}`,
                success: false
            });
        }

        const deductionAmount = useDeduction().deductionCounter(bodyData.base_salary, bodyData.deduction_type);
        console.log('AddDeduction (deductionAmount) : ', deductionAmount);

        const deduction = {
            emp_id: bodyData.emp_id,
            deduction_type: bodyData.deduction_type,
            amount: deductionAmount,
            note: bodyData.note
        }

        const response = await useDeduction().addNewOne(deduction);

        return res.status(201).json({
            message: "Successfully AddDeduction Served!",
            quick_serve_name: 'AddDeduction',
            success: true,
            data: response
        });
    } catch (error: any) {
        console.log('AddDeduction (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'AddDeduction' });
        } else {
            HandleError(res, error, 'AddDeduction');
        }
    }
};



const HandleError = (res: Response, error: any, quick_serve_name: string): Record<string, any> => {
    if (error?.code === "ER_NO_REFERENCED_ROW_2") {
        return NoReferenceRow2(error, res, quick_serve_name);
    }

    return res.status(500).json({
        message: "Failed to Serve!",
        quick_serve_name,
        success: false
    });
};



const NoReferenceRow2 = (error: any, res: Response, quick_serve_name: string): Record<string, any> => {
    const match = error?.sqlMessage?.match(/CONSTRAINT `(.*?)` FOREIGN KEY \(`(.*?)`\) REFERENCES `(.*?)` \(`(.*?)`\)/);
    const field = match ? match[2] : "unknown_field";
    const table = match ? match[3] : "unknown_table";
    const referencedField = match ? match[4] : "unknown_column";

    return res.status(404).json({
        message: "Invalid foreign key reference",
        read_me: "The data you are trying to link (foreign key) doesn't exist in the referenced table.",
        detail: `Field '${field}' in this request does not match any existing '${referencedField}' in the '${table}' table.`,
        quick_serve_name,
        success: false
    });
};