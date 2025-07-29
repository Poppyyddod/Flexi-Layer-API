import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { getAllDepartmentRequestPreset, getOneDepartmentRequestPreset } from "../presets/getDepartments.preset";



export const GetOneDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOneDepartment : ', req.body);

        const departmentId = req.params.depId;
        if (!departmentId) {
            res.status(400).json({
                message: "Param departmentId is required",
                quick_serve_name: 'GetOneDepartment',
                success: false
            });
        }

        const response = await StoreService(getOneDepartmentRequestPreset(departmentId), 'fetch');
        console.log('GetOneDepartment (response) : ', response);

        res.status(200).json({
            message: "Successfully GetOneDepartment Served!",
            quick_serve_name: 'GetOneDepartment',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOneDepartment (Error):', error);
        HandleError(res, error, 'GetOneDepartment');
    }
}









export const GetAllDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllDepartment : ', req.body);

        const response = await StoreService(getAllDepartmentRequestPreset(), 'fetch');
        console.log('GetAllDepartment (response) : ', response);

        if (response.length === 0) {
            return res.status(200).json({
                message: "No row in the table!",
                quick_serve_name: 'GetAllDepartment',
                success: false
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllDepartment Served!",
            quick_serve_name: 'GetAllDepartment',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllDepartment (Error):', error);
        HandleError(res, error, 'GetAllDepartment');
    }
}




const HandleError = (res: Response, error: any, quick_serve_name: string) => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown department id!",
            quick_serve_name,
            success: false
        });
    }

    return res.status(500).json({
        message: "Failed to Serve!",
        quick_serve_name,
        success: false
    });
}