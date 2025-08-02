import errorHandles from "@SRC/Helper/Data/Error";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import { UpdateEmployeeType } from "@SRC/QuickServe/models/employee.model";
import { updateEmployeeRequestPreset } from "@SRC/QuickServe/presets/employee.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



const ValidateUpdateEmployee = (req: Request, res: Response): boolean => {
    const { emp_name, emp_position_id, emp_department_id, emp_bank_account, emp_img, emp_email, emp_gender, emp_religion, emp_tel, emp_birth_date } = req.body as UpdateEmployeeType;

    if (!emp_name && !emp_position_id 
        && !emp_department_id && !emp_bank_account 
        && !emp_img && !emp_email 
        && !emp_gender && !emp_religion 
        && !emp_tel && !emp_birth_date) return false;

    return true;
};




export const UpdateEmployee = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('UpdateEmployee : ', req.body);

        const shouldContinue = ValidateUpdateEmployee(req, res);
        if (!shouldContinue) {
            return res.status(400).json({
                message: "Invalid request format!",
                quick_serve_name: 'UpdateEmployee',
                guide: {
                    emp_name: "string(Optional)",
                    emp_position_id: "number(Optional)",
                    emp_department_id: "number(Optional)",
                    emp_bank_account: "string(Optional)",
                    emp_img: "string(Optional)",
                    emp_email: "string(Optional)",
                    emp_gender: "string(Optional)",
                    emp_religion: "string(Optional)",
                    emp_tel: "string(Optional)",
                    emp_birth_date: "string(Optional)",
                },
                success: false
            });
        }

        const empId = req.params.empId;
        if (!empId) {
            return res.status(400).json({
                message: "Param empId is required",
                quick_serve_name: 'UpdateEmployee',
                success: false
            });
        }

        const bodyData = req.body as UpdateEmployeeType;
        const preset = updateEmployeeRequestPreset(empId, bodyData);

        const response = await StoreService(preset, 'edit');

        return res.status(200).json({
            message: "Successfully UpdateEmployee Served!",
            quick_serve_name: 'UpdateEmployee',
            success: true,
            data: {
                affectedRows: response.affectedRows,
                updated_at: useTime().getLocalTimeAsISOString()
            }
        });
    } catch (error: any) {
        console.log('UpdateEmployee (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'UpdateEmployee' });
        } else {
            HandleError(res, error, 'UpdateEmployee');
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