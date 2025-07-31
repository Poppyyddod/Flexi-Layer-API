import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import useWorkRecord from "@SRC/QuickServe/composables/useWorkRecord";
import { getAllLeaveDetailRequestPreset, getOneLeaveDetailRequestPreset } from "@SRC/QuickServe/presets/work_record/getLeaveDetail.preset";



export const GetOneLeaveDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOneLeaveDetail : ', req.body);

        const empId = req.params.empId;
        if (!empId) {
            return res.status(400).json({
                message: "Param employeeId is required",
                quick_serve_name: 'GetOneLeaveDetail',
                success: false
            });
        }

        const paramApproveState = req.params.leaveState;
        if (!useWorkRecord().paramApproveStateArr.includes(paramApproveState)) {
            return res.status(400).json({
                message: "Param leaveState is required",
                details: `Unknown '${paramApproveState}' leaveState.`,
                allowed: useWorkRecord().paramLeaveStateArr.join(', '),
                quick_serve_name: 'GetOneLeaveDetail',
                success: false
            });
        }

        const response = await StoreService(getOneLeaveDetailRequestPreset(empId, paramApproveState), 'fetch');
        console.log('GetOneLeaveDetail (response) : ', response);

        return res.status(200).json({
            message: "Successfully GetOneLeaveDetail Served!",
            quick_serve_name: 'GetOneLeaveDetail',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOneLeaveDetail (Error):', error);
        HandleError(res, error, 'GetOneLeaveDetail');
    }
}







export const GetAllLeaveDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllLeaveDetail : ', req.body);

        const paramLeaveState = req.params.leaveState;
        if (!useWorkRecord().paramLeaveStateArr.includes(paramLeaveState)) {
            return res.status(400).json({
                message: "Param paramLeaveStateArr is required",
                details: `Unknown '${paramLeaveState}' paramLeaveStateArr.`,
                allowed: useWorkRecord().paramLeaveStateArr.join(', '),
                quick_serve_name: 'GetAllLeaveDetail',
                success: false
            });
        }

        const response = await StoreService(getAllLeaveDetailRequestPreset(paramLeaveState), 'fetch');
        console.log('GetAllLeaveDetail (response) : ', response);

        if (response?.kind === "null_data") {
            return res.status(200).json({
                message: "No rows found!",
                quick_serve_name: 'GetAllLeaveDetail',
                success: true,
                data: []
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllLeaveDetail Served!",
            quick_serve_name: 'GetAllLeaveDetail',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllLeaveDetail (Error):', error);
        HandleError(res, error, 'GetAllLeaveDetail');
    }
}






const HandleError = (res: Response, error: any, quick_serve_name: string) => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Data is not found or may not exist.",
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