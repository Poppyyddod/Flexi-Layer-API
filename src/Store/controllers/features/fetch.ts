


/**
 * @function FetchStoreController - Dynamic Store Fetch data ສຳຫຼັບການດືງເອົາຂໍ້ມູນໃນ Store ນັ້ນໆ
 * @param helpers - functions
 * @param req - Request Data
 * @param res - Response HTTP
 * @returns Response HTTP
 */

import { DbTypeListKey, supportForDbTypes } from "@Helper/Data/Center/list/list.db-type.support";
import { isArray, isLengthZero, isNumber, isObject, isString } from "@Helper/Utils";

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

export const FetchStoreController = (helpers: any) => async (req: any, res: any) => {
    try {
        const { StoreService, Logger } = helpers; // Helper functions
        const { set, where, store_code, db_type, field_list, limit } = req.body; // Request

        if (set) {
            Logger('Store', 'warn', {
                message: `Set key object is not required for fetch !!`,
                system: 'Store',
                feature: 'fetch'
            })

            console.warn('\x1b[33m[WARNING] : `set` key object is not required for fetch !!\x1b[0m');
            delete req.body['set'];
        }

        if (!store_code
            || !db_type
            || (supportForDbTypes[db_type as DbTypeListKey].type === 'sql' && !field_list)
            || (field_list && !isArray(field_list) && field_list !== "*")
        ) {

            Logger('Store', 'error', {
                message: 'Incomplete request!',
                system: 'Store',
                store: store_code,
                feature: 'fetch',
                request_data: req.body
            });

            throw { kind: 'incomplete_request' };
        }

        if (req.body.hasOwnProperty('where')) {
            if (!isObject(where) && where !== "*" && !(isString(where) && where.split(':').length === 2)) {
                console.log('Invalid "where" value');
                throw { kind: 'incomplete_request', where };
            }
        }
        


        if (limit in req.body && !isNumber(limit) || limit <= 0) {
            throw { kind: 'fetch_limit_feature_error' };
        }

        if (where !== undefined && where === "*") {
            delete req.body['where'];
        }

        const dataFromServiceCenter = await StoreService(req.body, 'fetch');
        // console.log('FetchStoreController', response);

        if (dataFromServiceCenter.kind === 'null_data') {
            Logger('Store', 'info', {
                message: `No row in the store!`,
                system: 'Store',
                store: store_code,
                feature: 'fetch'
            });
        }

        Logger('Store', 'info', {
            message: `Successfully fetch ${where !== undefined && !isLengthZero(where) && where !== "*" ? 'some' : 'all'} row!!`,
            system: 'Store',
            store: store_code,
            feature: 'fetch'
        });

        const dataToControllerCenter = {
            response: {
                message: dataFromServiceCenter.kind === "null_data" ?
                    `No row in the store!`
                    :
                    `Successfully fetch ${where !== undefined && !isLengthZero(where) && where !== "*" ? 'some' : 'all'} row!!`,
                system: 'Store',
                feature: 'fetch',
                data: dataFromServiceCenter.kind === "null_data" ? [] : dataFromServiceCenter
            },
            status_code: 200
        }

        return dataToControllerCenter;
    } catch (error: any) {
        console.log('FetchStoreController (Error):', error);
        throw { ...error, feature: 'fetch', db_type: req.body.db_type };
    }
}