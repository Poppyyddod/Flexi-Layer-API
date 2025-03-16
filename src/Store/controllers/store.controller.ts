import ErrorHandles from '@Helper/Data/Error';
import Logger from '@Helper/Logger';
import StoreService from '@Store/services';
import { StoreControllerMethods } from './features/methods';
import { ControllerMethodRouteKeys } from '@Store/models/store.controller.model';
import { DbTypeListKey, supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';
import { isObject } from '@Helper/Utils';


/**
 * @functions
 * Helper functions
 */
const helperFunction = {
    ErrorHandles,
    Logger,
    StoreService
}



/**
 * @function StoreController - ສຳຫຼັບການ Map ເພື່ອເອີ້ນໃຊ້ Controller ຂອງ Feature ນັ້ນໆ
 * @param req - Request Data
 * @param res - Response HTTP
 * @returns 
 */

/**
 * 
 * @StoreControllerMethods
 * ເປັນຕົວປ່ຽນທີ່ເກັບ Methods ແຕ່ລະ Features
 */

/**
 * 
 * @StoreRouteKeys
 * Model ສຳຫຼັບ Route Keys
 */

const CheckDbConnection = async (reqBodyData: any) => {
    try {
        console.log('- StoreController (CheckDbConnection) : ', reqBodyData);
        const { db_type } = reqBodyData;

        const theDatabaseDetails = supportForDbTypes[db_type as DbTypeListKey];

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

const CheckMyIdValue = async (req: any) => {
    console.log('* Check and modify id value `myId`!');
    const { where, set } = req.body;

    if (where && isObject(where)) {
        Object.entries(where).map((key: any, value: any) => {
            console.log("req body where (modify myId) : ", key);
            if (key[1] === "myId") {
                console.log("Store Controller (Decoded token data) : ", req.user);
                where[key[0]] = parseInt(req.user.userId);
                return;
            }
        });
    }


    if (set && isObject(set)) {
        Object.entries(set).map((key: any, value: any) => {
            console.log("req body set (modify myId) : ", key);
            if (key[1] === "myId") {
                console.log("Store Controller (Decoded token data) : ", req.user);
                set[key[0]] = parseInt(req.user.userId);
                return;
            }
        });
    }

    if(!isObject(set) || !isObject(where))
        console.log('* - set or where is not object!');
}

const StoreController = async (req: any, res: any) => {
    try {
        console.log('> Store Controller : ', req.body);
        console.log('Request user (Verify token) : ', req?.user);

        await CheckDbConnection(req.body);

        const theRoute = req.path as ControllerMethodRouteKeys;
        console.log(`- Request route : ${theRoute}`);

        if (!Object.keys(supportForDbTypes).includes(req.body.db_type)) {
            throw { kind: 'cannot_support_the_database_type' };
        }

        if (req.user) {
            await CheckMyIdValue(req);
        }

        const controller = StoreControllerMethods[theRoute];
        const dataFromTheController = await controller(helperFunction)(req, res);
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

export default StoreController;
