import errorHandles from "@SRC/Helper/Data/Error";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import { UpdatePositionType } from "@SRC/QuickServe/models/position.model";
import { updatePositionRequestPreset } from "@SRC/QuickServe/presets/position.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



const ValidateUpdatePosition = (req: Request, res: Response): boolean => {
    const { position_name, position_salary } = req.body as UpdatePositionType;

    if (!position_name && !position_salary) return false;

    return true;
};




export const UpdatePosition = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('UpdatePosition : ', req.body);

        const shouldContinue = ValidateUpdatePosition(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'UpdatePosition',
                guide: {
                    position_name: "string(Optional)",
                    position_salary: "number(Optional)",
                },
                success: false
            });
        }

        const posId = req.params.posId;
        if (!posId) {
            return res.status(400).json({
                message: "Param posId is required",
                quick_serve_name: 'UpdatePosition',
                success: false
            });
        }

        const bodyData = req.body as UpdatePositionType;
        const preset = updatePositionRequestPreset(posId, bodyData);

        const response = await StoreService(preset, 'edit');

        return res.status(200).json({
            message: "Successfully UpdatePosition Served!",
            quick_serve_name: 'UpdatePosition',
            success: true,
            data: {
                affectedRows: response.affectedRows,
                updated_at: useTime().getLocalTimeAsISOString()
            }
        });
    } catch (error: any) {
        console.log('UpdatePosition (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'UpdatePosition' });
        } else {
            HandleError(res, error, 'UpdatePosition');
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