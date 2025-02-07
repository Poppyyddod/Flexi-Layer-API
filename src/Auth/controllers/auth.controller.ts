import ErrorHandles from "@Helper/Data/Error";
import Logger from "@Helper/Logger";
import { authControllerMethods, AuthControllerKeyRoutes } from "./method";
import AuthCenterService from "../services/auth.service";
import { supportForDbTypes } from "@Helper/Data/Center/list/list.db-type.support";


const helperFunctions = {

}


const CheckDbConnection = async (reqBodyData: any) => {
    try {
        console.log('- StoreController (CheckDbConnection) : ', reqBodyData);
        const { db_type } = reqBodyData;

        const theDatabaseDetails = supportForDbTypes[db_type];

        if (!theDatabaseDetails) {
            throw { kind: 'cannot_support_the_database_type' }
        }

        if (!theDatabaseDetails.connect_state) {
            throw { kind: 'we_disconnect_the_database' };
        }
    } catch (error) {
        console.log('StoreController (CheckDbConnection)(error) : ', error);
        throw error;
    }
}

const AuthCenterController = async (req: any, res: any) => {
    try {
        console.log('> AuthCenterController : ', req.body);

        await CheckDbConnection(req.body);

        const theRoute = req.path as AuthControllerKeyRoutes;
        console.log(`- Request route : ${theRoute}`);

        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(`- Request user-ip : ${userIp}`);

        const controller = await authControllerMethods[theRoute];
        const dataFromTheController = await controller(helperFunctions)(req.body);
        console.log('AuthCenterController (response) : ', dataFromTheController);

        const { data, feature } = dataFromTheController;

        const dataFromCenterService: any = await AuthCenterService(res, data, feature);

        Logger('Auth', 'info', {
            more: dataFromCenterService.response.data?.[0] || dataFromCenterService.response,
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