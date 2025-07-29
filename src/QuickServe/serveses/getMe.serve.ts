import { $Settings } from "@SRC/Helper/Middlewares/middleware.setting";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { getMeEmployeeRequestPreset } from "../presets/getMe.preset";
import errorHandles from "@SRC/Helper/Data/Error";

export const GetMe = async (req: any, res: Response): Promise<any> => {
    try {
        console.log('GetMe (req.params) :', req.params);
        console.log('GetMe (req.user) :', req.user);

        if (!$Settings.useAuthToken) throw { kind: 'auth_token_setting_turn_off' };

        const { userId } = req.params;
        if (!userId) throw { kind: 'incomplete_request' };

        const paramUserId = parseInt(userId);

        if (paramUserId !== req.user?.user_id)
            throw { kind: 'param_ids_not_match_with_token_data' };

        const empRes = await StoreService(getMeEmployeeRequestPreset(userId), 'fetch');
        console.log('GetMe (empData) :', empRes);

        const empData = empRes[0];

        res.status(200).json({
            message: 'Successfully get data!',
            data: empData
        });
    } catch (error: any) {
        console.log('GetMe (Error):', error);
        await errorHandles(error, res, { systemName: 'Auth', feature: 'get-me' });
        // HandleError(res, error, 'GetMe');
    }
};



const HandleError = (res: Response, error: any, quick_serve_name: string) => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown the user id!",
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