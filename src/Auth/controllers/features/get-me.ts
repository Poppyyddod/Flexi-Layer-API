import { IReturnToControllerCenter } from "@SRC/Auth/models/auth.global.model";
import errorHandles from "@SRC/Helper/Data/Error";
import { $Settings } from "@SRC/Helper/Middlewares/middleware.setting";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";

export const GetMyData = async (req: any, res: Response): Promise<any> => {
    try {
        console.log('AuthGetMeController (req.params) :', req.params);
        console.log('AuthGetMeController (req.user) :', req.user);

        if (!$Settings.useAuthToken) throw { kind: 'auth_token_setting_turn_off' };

        const { id } = req.params;
        if (!id) throw { kind: 'incomplete_request' };

        const paramUserId = parseInt(id);

        if (paramUserId !== req.user?.user_id) 
            throw { kind: 'param_ids_not_match_with_token_data' };

        res.status(200).json({
            message: 'Successfully get my data!',
            data: req.user
        });
    } catch (error: any) {
        console.log('AuthGetMeController (Error):', error);
        await errorHandles(error, res, { systemName: 'Auth', feature: 'get-me' });
    }
};
