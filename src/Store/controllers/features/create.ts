import { DbTypeListKey, supportForDbTypes } from "@Helper/Data/Center/list/list.db-type.support";
import { isLengthZero } from "@Helper/Utils";


/**
 * @function CreateStoreController - Dynamic Store Create ສຳຫຼັບການສ້າງ Record ໃໝ່
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

export const CreateStoreController = (helpers: any) => async (req: any, res: any) => {
    try {
        // console.log('> CreateStoreController : ');
        // console.log('- Request Body : ', req.body);

        const { StoreService, Logger } = helpers; // Helper functions
        const { db_type, store_code, set, where, nosql_supporter } = req.body; // Request

        if (where) {
            Logger('Store', 'warn', {
                message: '`where` key object is not required for create function !!',
                system: 'Store',
                store: store_code,
                feature: 'create'
            });

            console.warn('\x1b[33m [WARNING] : `where` key object is not required for create !!\x1b[0m');
            delete req.body['where'];
        }

        if (!db_type || !store_code || !set || isLengthZero(set) || (supportForDbTypes[db_type as DbTypeListKey].type === 'nosql' && !nosql_supporter)) {
            Logger('Store', 'error', {
                message: 'Incomplete request!',
                system: 'Store',
                store: store_code,
                feature: 'create',
                request_data: req.body
            });

            throw { kind: 'incomplete_request' };
        }

        const dataFromServiceCenter = await StoreService(req.body, 'create');
        // console.log('CreateStoreController', response);

        const data = {
            message: 'New data from the request successfully created!',
            system: 'Store',
            feature: 'create',
            store: store_code,
            data: dataFromServiceCenter,
        }

        Logger('Store', 'info', {
            ...data
        });

        const dataToControllerCenter = {
            response: data,
            status_code: 201
        }

        return dataToControllerCenter;
    } catch (error: any) {
        console.log('CreateStoreController (Error):', error);

        if (error?.code === '23505' || error?.sqlState === '23000') {
            throw { kind: 'unique_create_row_data', detail: error?.detail, feature: 'create' };
        }

        throw { ...error, feature: 'create', db_type: req.body.db_type };
    }
}