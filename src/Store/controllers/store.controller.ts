import ErrorHandles from '@Helper/Data/Error';
import Logger from '@Helper/Logger';
import StoreService from '@Store/services';
import { StoreControllerEndpoint, StoreControllerMethods } from './methods';
import { DbTypeListKey, supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';
import { loadEnvConfig } from '@Configs/env';
import { IMyRequestData } from '@SRC/Helper/Model/global.model';
import { Request, Response } from 'express';
import { $Settings } from '@SRC/Helper/Middlewares/middleware.setting';
import { $SettingFunctions } from '@SRC/Helper/Utils/Setting';
import { IReturnToCenterServiceData } from '@SRC/Auth/models/auth.global.model';
import { IStoreReturnToControllerCenter } from '../models/store.controller.model';
// import { ResolveRequestPlaceholdersUsingToken } from '@SRC/Helper/Utils/Setting/check-token-user.id';

const RAW_ENV = loadEnvConfig();

/**
 * @functions
 * Helper functions
 */
const helperFunction = {
    ErrorHandles,
    Logger,
    StoreService
}



const CheckDbConnection = (reqBodyData: IMyRequestData, endpointPath: string): void => {
    try {
        console.log('- StoreController (CheckDbConnection) : ', reqBodyData, endpointPath);
        const splittedFeature = endpointPath.split('/')[2];

        // Check Database Type
        if (reqBodyData.db_type === undefined)
            throw { kind: 'incomplete_main_request', feature: splittedFeature };

        const { db_type } = reqBodyData;

        // Find Database Type
        const theDatabaseDetails = supportForDbTypes[db_type as DbTypeListKey];
        if (theDatabaseDetails === undefined)
            throw { kind: 'cannot_support_the_database_type', feature: splittedFeature };

        // Check Database Connection Setting
        if (!theDatabaseDetails.connect_state)
            throw { kind: 'we_disconnect_the_database', feature: splittedFeature };
    } catch (error) {
        console.log('StoreController (CheckDbConnection)(error) : ', error);
        throw error;
    }
}






const StoreControllerCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log('> Store Controller : ', req.body);

        const endpoint = req.path as StoreControllerEndpoint;
        console.log(`- Request route : ${endpoint}`);

        // `db_type` Validation
        CheckDbConnection(req.body, endpoint);

        // Setting Function Part
        if ($Settings.useCheckTokenPlaceholder)
            await $SettingFunctions.ResolveRequestPlaceholdersUsingToken(req);

        const controller = StoreControllerMethods[endpoint];
        const dataFromTheController: IStoreReturnToControllerCenter = await controller(helperFunction)(req, res);
        // console.log('StoreController (response) : ', response);

        const { response, status_code } = dataFromTheController;

        return res.status(status_code).json({
            ...response
        });
    } catch (error: any) {
        console.log('StoreController (Error):', error);
        const theError = { ...(typeof error === 'object' ? error : {}), functionName: `${error.feature} store data` };

        return await ErrorHandles(theError, res, {
            systemName: 'Store',
            feature: error.feature
        });
    }
}

export default StoreControllerCenter;
