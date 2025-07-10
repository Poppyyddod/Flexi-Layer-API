import { isLengthZero } from "@Helper/Utils";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { IStoreReturnToControllerCenter } from "@SRC/Store/models/store.controller.model";
import { Request, Response } from "express";


/**
 * @function DeleteStoreController - Dynamic Store Delete ສຳຫຼັບການລົບຂໍ້ມູນໃນ Database Table/Store
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

export const DeleteStoreController = (helpers: any) => async (req: Request, res: Response): Promise<IStoreReturnToControllerCenter> => {
    try {
        const { StoreService, Logger } = helpers; // Helper functions
        const { set, where, store_code, db_type } = req.body as IMyRequestData; // Request

        if (set) {
            console.warn('[WARNING] : `set` key object is not required for remove !!');
            delete req.body['set'];
        }

        if (!db_type || !where || !store_code || isLengthZero(where)) {
            Logger('Store', 'error', {
                message: 'Incomplete request!',
                system: 'Store',
                store: store_code,
                feature: 'delete',
                request_data: req.body
            });

            throw { kind: 'incomplete_request' };
        }

        const dataFromServiceCenter = await StoreService(req.body, 'delete');
        console.log('DeleteStoreController : ', dataFromServiceCenter);

        const data = {
            message: `The data matching the request has been deleted!`,
            system: 'Store',
            store: store_code,
            feature: 'delete',
            request_data: req.body,
            affectedRows: dataFromServiceCenter.affectedRows
        }

        Logger('Store', 'info', {
            ...data
        });

        const dataToControllerCenter: IStoreReturnToControllerCenter = {
            response: {
                ...data
            },
            status_code: 200
        }

        return dataToControllerCenter;
    } catch (error: any) {
        console.log('DeleteStoreController (Error):', error);
        throw { ...error, feature: 'delete' };
    }
}