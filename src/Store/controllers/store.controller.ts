import ErrorHandles from '@Helper/Data/Error';
import Logger from '@Helper/Logger';
import StoreService from '@Store/services';
import { StoreControllerMethods } from './features/methods';
import { ControllerMethodRouteKeys } from '@Store/models/store.controller.model';
import { DbTypeListKey, supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';
import { isArray, isObject } from '@Helper/Utils';
import { useAuthToken } from '@SRC/Helper/Middlewares/middleware.setting';
import { loadEnvConfig } from '@Configs/env';

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

        if (reqBodyData.db_type === undefined)
            throw { kind: 'incomplete_request' };

        const { db_type } = reqBodyData;

        const theDatabaseDetails = supportForDbTypes[db_type as DbTypeListKey];

        if (theDatabaseDetails === undefined)
            throw { kind: 'cannot_support_the_database_type' };

        if (!theDatabaseDetails.connect_state)
            throw { kind: 'we_disconnect_the_database' };
    } catch (error) {
        console.log('StoreController (CheckDbConnection)(error) : ', error);
        throw error;
    }
}

const CheckMyIdValue = async (req: any) => {
    console.log('* Check and modify id value `myId`!');

    const { where, set } = req.body;

    const modifyMyId = (obj: any, fieldName: string) => {
        if (isObject(obj)) {
            Object.keys(obj).forEach((key: any) => {
                if (obj[key] === "myId") {
                    if (!useAuthToken) {
                        throw { kind: "auth_setting_turn_off" };
                    }

                    console.log("Store Controller (Decoded token data) : ", req.user);
                    obj[key] = parseInt(req.user.userId);
                }
            });
        } else if (isArray(obj)) {
            obj.forEach((item: any, itemIndex: number) => {
                // console.log("Check value myId (item) : ", item, itemIndex);
                Object.keys(item).forEach((key: any, keyIndex: number) => {
                    // console.log("Check value myId (key, index) : ", key, keyIndex);
                    if (obj[itemIndex][key] === "myId") {
                        if (!useAuthToken) {
                            throw { kind: "auth_setting_turn_off" };
                        }

                        console.log("Store Controller (Decoded token data) : ", req.user);
                        obj[itemIndex][key] = parseInt(req.user.userId);
                        // console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPAAAAAAAAAA", obj[itemIndex]);
                    }
                });
            })
        } else {
            console.log(`* - ${fieldName} is not object!`);
            return;
        }
    };

    modifyMyId(where, "where");
    modifyMyId(set, "set");
};

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

        await CheckMyIdValue(req);

        if (!StoreControllerMethods[theRoute]) {
            throw { kind: "route_is_not_valid" };
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
