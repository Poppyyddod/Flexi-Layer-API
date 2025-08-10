import { getAllEmployeeHolidaysRequestPreset, getOneEmployeeHolidaysRequestPreset } from "@SRC/QuickServe/presets/employeeHolidays.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";



export const GetOneEmployeeHolidays = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOneEmployeeHolidays : ', req.body);

        const empId = req.params.empId;
        if (!empId) {
            res.status(400).json({
                message: "Param employeeId is required",
                quick_serve_name: 'GetOneEmployeeHolidays',
                success: false
            });
        }

        const response = await StoreService(getOneEmployeeHolidaysRequestPreset(empId), 'fetch');
        console.log('GetOneEmployeeHolidays (response) : ', response);

        res.status(200).json({
            message: "Successfully GetOneEmployeeHolidays Served!",
            quick_serve_name: 'GetOneEmployeeHolidays',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOneEmployeeHolidays (Error):', error);
        HandleError(res, error, 'GetOneEmployeeHolidays');
    }
}










export const GetAllEmployeeHolidays = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllEmployeeHolidays : ', req.body);

        const response = await StoreService(getAllEmployeeHolidaysRequestPreset(), 'fetch');
        console.log('GetAllEmployeeHolidays (response) : ', response);

        if (response?.kind === "null_data") {
            return res.status(200).json({
                message: "No rows found!",
                quick_serve_name: 'GetAllEmployeeHolidays',
                success: false
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllEmployeeHolidays Served!",
            quick_serve_name: 'GetAllEmployeeHolidays',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllEmployeeHolidays (Error):', error);
        HandleError(res, error, 'GetAllEmployeeHolidays');
    }
}




const HandleError = (res: Response, error: any, quick_serve_name: string) => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown employee id!",
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