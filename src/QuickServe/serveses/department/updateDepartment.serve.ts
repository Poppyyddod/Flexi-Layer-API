import errorHandles from "@SRC/Helper/Data/Error";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import { UpdateDepartmentType } from "@SRC/QuickServe/models/department.model";
import { updateDepartmentRequestPreset } from "@SRC/QuickServe/presets/department.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



const ValidateUpdateDepartment = (req: Request, res: Response): boolean => {
    const { department_name, department_code, description } = req.body as UpdateDepartmentType;

    if (!department_name && !department_code && !description) return false;

    return true;
};




export const UpdateDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('UpdateDepartment : ', req.body);

        const shouldContinue = ValidateUpdateDepartment(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'UpdateDepartment',
                guide: {
                    department_name: "string(Optional)",
                    department_code: "string(Optional)",
                    description: "string(Optional)",
                },
                success: false
            });
        }

        const depId = req.params.depId;
        if (!depId) {
            return res.status(400).json({
                message: "Param depId is required",
                quick_serve_name: 'UpdateDepartment',
                success: false
            });
        }

        const bodyData = req.body as UpdateDepartmentType;
        const preset = updateDepartmentRequestPreset(depId, bodyData);

        const response = await StoreService(preset, 'edit');

        return res.status(200).json({
            message: "Successfully UpdateDepartment Served!",
            quick_serve_name: 'UpdateDepartment',
            success: true,
            data: {
                affectedRows: response.affectedRows,
                updated_at: useTime().getLocalTimeAsISOString()
            }
        });
    } catch (error: any) {
        console.log('UpdateDepartment (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'UpdateDepartment' });
        } else {
            HandleError(res, error, 'UpdateDepartment');
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