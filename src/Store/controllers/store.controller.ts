import ErrorHandles from '@Helper/Data/Error';
import Logger from '@Helper/Logger';
import StoreService from '@Store/services';
import { StoreControllerMethods } from './features/methods';
import { ControllerMethodRouteKeys } from '@Store/models/store.controller.model';
import { supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';


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

const StoreController = async (req: any, res: any) => {
    try {
        console.log('> Store Controller : ', req.body);

        const theRoute = req.path as ControllerMethodRouteKeys;
        console.log(`- Request route : ${theRoute}`);

        if (!Object.keys(supportForDbTypes).includes(req.body.db_type)) {
            throw { kind: 'cannot_support_the_database_type' };
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
