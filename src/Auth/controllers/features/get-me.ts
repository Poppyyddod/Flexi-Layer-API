import { IReturnToControllerCenter } from "@SRC/Auth/models/auth.global.model";
import errorHandles from "@SRC/Helper/Data/Error";
import { Request, Response } from "express";

export const AuthGetMeController = async (req: any, res: Response): Promise<any> => {
    try {
        console.log('AuthGetMeController (req.params) :', req.params);
        console.log('AuthGetMeController (req.user) :', req.user);

        const { id } = req.params;
        if (!id) throw { kind: 'incomplete_request' };

        const userId = req.params.id;

        res.json({
            message: 'Successfully get my data!',
            data: req.user
        });
    } catch (error: any) {
        console.log('AuthGetMeController (Error):', error);
        await errorHandles(error, res, { systemName: 'Auth', feature: 'get-me' });
    }
};
