import errorHandles from "@SRC/Helper/Data/Error";
import { AddDepartmentType } from "@SRC/QuickServe/models/department.model";
import { createDepartmentRequestPreset } from "@SRC/QuickServe/presets/department/createDepartment.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



const ValidateAddDepartment = (req: Request, res: Response): boolean => {
    const { department_name, department_code } = req.body as AddDepartmentType;

    if (!department_name || !department_code) return false;

    return true;
};




export const AddDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('AddDepartment : ', req.body);

        const shouldContinue = ValidateAddDepartment(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'AddDepartment',
                guide: {
                    position_name: "string",
                    position_salary: "number",
                },
                success: false
            });
        }

        const bodyData = req.body as AddDepartmentType;
        const preset = createDepartmentRequestPreset(bodyData);

        const response = await StoreService(preset, 'create');

        return res.status(201).json({
            message: "Successfully AddDepartment Served!",
            quick_serve_name: 'AddDepartment',
            success: true,
            data: response
        });
    } catch (error: any) {
        console.log('AddDepartment (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'AddDepartment' });
        } else {
            HandleError(res, error, 'AddDepartment');
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