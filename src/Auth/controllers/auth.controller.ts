import ErrorHandles from "@Helper/Data/Error";
import Logger from "@Helper/Logger";
import { authControllerMethods, AuthControllerKeyRoutes } from "./method";
import AuthCenterService from "../services/auth.service";


const helperFunctions = {

}


const AuthCenterController = async (req: any, res: any) => {
    try {
        console.log('> AuthCenterController : ', req.body);

        const theRoute = req.path as AuthControllerKeyRoutes;
        console.log(`- Request route : ${theRoute}`);

        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(`- Request user-ip : ${userIp}`);

        const controller = await authControllerMethods[theRoute];
        const dataFromTheController = await controller(helperFunctions)(req.body);
        console.log('AuthCenterController (response) : ', dataFromTheController);

        const { data, feature } = dataFromTheController;

        const dataFromCenterService: any = await AuthCenterService(data, feature);

        Logger('Auth', 'info', {
            more: dataFromCenterService.response.data[0],
            feature
        });

        const { response, status_code } = dataFromCenterService;

        return res.status(status_code).json({
            ...response
        })
    } catch (error: any) {
        console.log('AuthCenterController (error) : ', error);

        const theError = { ...error, functionName: `${error.feature} auth` };

        return await ErrorHandles(theError, res, {
            systemName: 'Auth',
            feature: error.feature
        });
    }
}

export default AuthCenterController;