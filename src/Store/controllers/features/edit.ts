import { DbTypeListKey, supportForDbTypes } from "@Helper/Data/Center/list/list.db-type.support";
import { isLengthZero, isObject, isString } from "@Helper/Utils";


/**
 * @function EditStoreController - Dynamic Store Edit ສຳຫຼັບການແກ້ໄຂຂໍ້ມູນຂອງ Rows
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

export const EditStoreController = (helpers: any) => async (req: any, res: any) => {
    try {
        const { StoreService, Logger } = helpers; // Helper functions
        const { set, where, store_code, db_type, nosql_supporter } = req.body; // Request

        if (supportForDbTypes[db_type as DbTypeListKey].type === 'nosql') {
            if (!nosql_supporter)
                throw { kind: 'incomplete_request' };

            if (!nosql_supporter.request_confirmed) {
                throw { kind: 'missing_supporter_confirmed_feature' };
            }
        }

        if (db_type === undefined || !set || !isObject(req.body.where) || !store_code || isLengthZero(set) || isLengthZero(req.body.where)) {
            Logger('Store', 'error', {
                message: 'Incomplete request!',
                system: 'Store',
                store: store_code,
                feature: 'edit',
                request_data: req.body
            });

            throw { kind: 'incomplete_request' };
        }

        const dataFromServiceCenter = await StoreService(req.body, 'edit');
        // console.log('EditStoreController', response);

        const data = {
            message: `The data matching the request has been edited!`,
            system: 'Store',
            feature: 'edit',
            store_code,
            query: req.body,
            affectedRows: dataFromServiceCenter.affectedRows
        }

        Logger('Store', 'info', {
            ...data,
        });

        const dataToControllerCenter = {
            response: {
                ...data
            },
            status_code: 200
        }

        return dataToControllerCenter;
    } catch (error: any) {
        console.log('EditStoreController (Error):', error);

        if (error?.code === '23505' || error?.sqlState === '23000') {
            throw { kind: 'unique_edit_row_data', detail: error?.detail, feature: 'create' };
        }

        throw { ...error, feature: 'edit', db_type: req.body.db_type };
    }
}