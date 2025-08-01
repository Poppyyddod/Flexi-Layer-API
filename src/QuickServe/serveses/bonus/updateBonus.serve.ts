import errorHandles from "@SRC/Helper/Data/Error";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import { UpdateBonusType } from "@SRC/QuickServe/models/bonus.model";
import { updateBonusRequestPreset } from "@SRC/QuickServe/presets/bonus.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



const ValidateUpdateBonus = (req: Request, res: Response): boolean => {
    const { emp_id, salary_month, bonus_type, amount, note } = req.body as UpdateBonusType;

    if (!emp_id && !salary_month && !bonus_type && !amount) return false;

    return true;
};




export const UpdateBonus = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('UpdateBonus : ', req.body);

        const shouldContinue = ValidateUpdateBonus(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'UpdateBonus',
                guide: {
                    emp_id: "number(Optional)",
                    salary_month: "string(Optional)",
                    amount: "number(Optional)",
                    bonus_type: "string(Optional)",
                    note: "string(Optional)"
                },
                success: false
            });
        }

        const bonusId = req.params.bonusId;
        if (!bonusId) {
            return res.status(400).json({
                message: "Param bonusId is required",
                quick_serve_name: 'UpdateBonus',
                success: false
            });
        }

        const bodyData = req.body as UpdateBonusType;
        const preset = updateBonusRequestPreset(bonusId, bodyData);

        const response = await StoreService(preset, 'edit');

        return res.status(200).json({
            message: "Successfully UpdateBonus Served!",
            quick_serve_name: 'UpdateBonus',
            success: true,
            data: {
                affectedRows: response.affectedRows,
                updated_at: useTime().getLocalTimeAsISOString()
            }
        });
    } catch (error: any) {
        console.log('UpdateBonus (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'UpdateBonus' });
        } else {
            HandleError(res, error, 'UpdateBonus');
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