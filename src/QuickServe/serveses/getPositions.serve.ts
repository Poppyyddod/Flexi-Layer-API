import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { getAllPositionsRequestPreset, getOnePositionRequestPreset } from "../presets/getPositions.preset";



export const GetOnePosition = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetOnePosition : ', req.body);

        const positonId = req.params.posId;
        if (!positonId) {
            res.status(400).json({
                message: "Param positonId is required",
                quick_serve_name: 'GetOnePosition',
                success: false
            });
        }

        const response = await StoreService(getOnePositionRequestPreset(positonId), 'fetch');
        console.log('GetOnePosition (response) : ', response);

        res.status(200).json({
            message: "Successfully GetOnePosition Served!",
            quick_serve_name: 'GetOnePosition',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetOnePosition (Error):', error);
        HandleError(res, error, 'GetOnePosition');
    }
}









export const GetAllPosition = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('GetAllPosition : ', req.body);

        const response = await StoreService(getAllPositionsRequestPreset(), 'fetch');
        console.log('GetAllPosition (response) : ', response);

        if (response.length === 0) {
            return res.status(200).json({
                message: "No row in the table!",
                quick_serve_name: 'GetAllPosition',
                success: false
            });
        }

        return res.status(200).json({
            message: "Successfully GetAllPosition Served!",
            quick_serve_name: 'GetAllPosition',
            success: true,
            data: response
        });
    } catch (error) {
        console.log('GetAllPosition (Error):', error);
        HandleError(res, error, 'GetAllPosition');
    }
}




const HandleError = (res: Response, error: any, quick_serve_name: string) => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown position id!",
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