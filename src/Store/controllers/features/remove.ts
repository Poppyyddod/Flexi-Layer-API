import { DbTypeListKey, supportForDbTypes } from "@Helper/Data/Center/list/list.db-type.support";
import { isLengthZero } from "@Helper/Utils";


/**
 * @function RemoveStoreController - Dynamic Store Remove ສຳຫຼັບການລົບຂໍ້ມູນໃນ Database Table/Store
 * @param helpers - functions
 * @param req - Request Data
 * @param res - Response HTTP
 * @returns Response HTTP
 */

/**
 * @function isLengthZero
 * ເອີ້ນໃຊ້ຈາກ Helper/Helper.utils ສຳຫຼັບການກວດວ່າ Key Object, Array Object ນັ້ນ length ເທົ່າ 0 ຫຼືບໍ
 */

/**
 * @function Logger
 * ເອີ້ນໃຊ້ຈາກ Helper/Logger ສຳຫຼັບການບັນທຶກເຫດການຕ່າງໆທີ່ເກີດຂື້ນໃນ Server ລົງໃນ logs
 */

/**
 * @function StoreService
 * ສຳຫຼັບ Methods Mapping ຕ່າງໆຂອງແຕ່ລະ Feature
 */

/**
 * 
 * @function errorHandles
 * ສຳຫຼັບການກວດສອບ Error ຕ່າງໆທີ່ສົ່ງມາ
 * @returns {Json Object} - HTTP Response
 */

export const RemoveStoreController = (helpers: any) => async (req: any, res: any) => {
    try {
        const { StoreService, Logger } = helpers; // Helper functions
        const { set, where, store_code, db_type, nosql_supporter } = req.body; // Request

        if (set) {
            console.warn('[WARNING] : `set` key object is not required for remove !!');
            delete req.body['set'];
        }

        if (supportForDbTypes[db_type as DbTypeListKey].type === 'nosql') {
            if (!nosql_supporter)
                throw { kind: 'incomplete_request' };

            if (!nosql_supporter.request_confirmed && !nosql_supporter.ignore_supporter)
                throw { kind: 'missing_supporter_confirmed_feature' };
        }

        if (!db_type || !where || !store_code || isLengthZero(where)) {
            Logger('Store', 'error', {
                message: 'Incomplete request!',
                system: 'Store',
                store: store_code,
                feature: 'remove',
                request_data: req.body
            });

            throw { kind: 'incomplete_request' };
        }

        const dataFromServiceCenter = await StoreService(req.body, 'remove');
        console.log('RemoveStoreController : ', dataFromServiceCenter);

        const data = {
            message: `The data matching the request has been deleted!`,
            system: 'Store',
            store: store_code,
            feature: 'remove',
            request_data: req.body,
            affectedRows: dataFromServiceCenter.affectedRows
        }

        Logger('Store', 'info', {
            ...data
        });

        const dataToControllerCenter = {
            response: {
                ...data
            },
            status_code: 200
        }

        return dataToControllerCenter;
    } catch (error: any) {
        console.log('RemoveStoreController (Error):', error);
        throw { ...error, feature: 'remove' };
    }
}