import errorHandles from "@SRC/Helper/Data/Error";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import { UpdateDeductionType } from "@SRC/QuickServe/models/deduction.model";
import { updateDeductionRequestPreset } from "@SRC/QuickServe/presets/deduction.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



const ValidateUpdateDeduction = (req: Request, res: Response): boolean => {
    const { emp_id, salary_month, deduction_type, amount } = req.body as UpdateDeductionType;

    if (!emp_id && !salary_month && !deduction_type && !amount) return false;

    return true;
};




export const UpdateDeduction = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('UpdateDeduction : ', req.body);

        const shouldContinue = ValidateUpdateDeduction(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'UpdateDeduction',
                guide: {
                    emp_id: "number(Optional)",
                    salary_month: "string(Optional)",
                    deduction_type: "string(Optional)",
                    amount: "number(Optional)"
                },
                success: false
            });
        }

        const depId = req.params.depId;
        if (!depId) {
            return res.status(400).json({
                message: "Param depId is required",
                quick_serve_name: 'UpdateDeduction',
                success: false
            });
        }

        const bodyData = req.body as UpdateDeductionType;
        const preset = updateDeductionRequestPreset(depId, bodyData);

        const response = await StoreService(preset, 'edit');

        return res.status(200).json({
            message: "Successfully UpdateDeduction Served!",
            quick_serve_name: 'UpdateDeduction',
            success: true,
            data: {
                affectedRows: response.affectedRows,
                updated_at: useTime().getLocalTimeAsISOString()
            }
        });
    } catch (error: any) {
        console.log('UpdateDeduction (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'UpdateDeduction' });
        } else {
            HandleError(res, error, 'UpdateDeduction');
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