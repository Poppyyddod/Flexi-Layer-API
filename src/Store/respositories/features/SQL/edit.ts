/**
 * @function EditStoreRespo - ສຳຫຼັບສື່ສານກັບ Database ໃຫ້ແກ້ໄຂຂໍ້ມູນຕາມທີ່ Request
 * @param helpers - Helper functions
 * @param store - ຊື່ Store/Table
 * @param fixedFormat - ເປັນ ຂໍ້ມູນທີ່ມີການ fixed ມາແລ້ວ
 * @returns SQL Data || Object
 */

import { ValidAllDataFromService } from "@Store/models/store.respository.model";

/**
 * 
 * @function SQLmanagement
 * ສຳຫຼັບການຈັດການສົ່ງຄຳສັ່ງ Query (Helper)
 */

/**
 * @set - fixedFormat
 * ເປັນ Object ຂອງ Request body
 */

/**
 * 
 * @set , @where - fixedFormat
 * ເປັນ Object ທີ່ເກັບ ຄຳສັ່ງທີ່ fixed ກັບ Placeholder ແລ້ວຈາກ Request ແລ້ວ
 * ເຊັ່ນ: id = ? | fields = ?
 */

/**
 * @params - fixedFormat
 * ເປັນ Array Object ທີ່ເກັບຄ່າທີ່ມາຈາກ Request ເພື່ອໄປໃຊ້ກັບ Placeholder
 */


const dbTypeEditRespository: any = {
    postgresql: (fixedFormat: any) => {
        const { set, where, params, store } = fixedFormat;

        const cmd = `UPDATE ${store} SET ${set} WHERE ${where}`;
        const paramsQuery = [...params];

        return {
            cmd,
            paramsQuery
        }
    },

    mysql: (fixedFormat: any) => {
        const { set, where, params, store } = fixedFormat;

        const cmd = `UPDATE ?? SET ${set} WHERE ${where}`;
        console.log('EditStoreRespo (cmd) : ', cmd);

        const paramsQuery = [store, ...params];

        return {
            cmd,
            paramsQuery
        }
    }
}


export const EditSqlStoreRespo = (helpers: any) => async (dataFromResposCenter: ValidAllDataFromService) => {
    try {
        const { SQLmanagement } = helpers;
        const { db_type, store, fixedFormat } = dataFromResposCenter;
        
        console.log('EditStoreRespo', store, db_type);
        console.log('Set : ', fixedFormat.set);
        console.log('Fixed Params : ', fixedFormat.params);
        
        const dataToMapping = {
            ...fixedFormat,
            store
        }

        const mappedData = await dbTypeEditRespository[db_type](dataToMapping);
        const {cmd, paramsQuery} = mappedData;

        // console.log('mappedData (EditStoreRespo) : ', mappedData);

        const response = await SQLmanagement(db_type, { cmd, params: paramsQuery, isReturn: true });
        // console.log('EditStoreRespo (response) : ', response);

        return response;
    } catch (error) {
        // console.log('EditStoreRespo (Error):', error);
        throw error;
    }
}