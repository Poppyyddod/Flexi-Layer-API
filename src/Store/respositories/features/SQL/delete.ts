/**
 * @function DeleteStoreRespo - ສຳຫຼັບສື່ສານກັບ Database ໃຫ້ລົບຂໍ້ມູນຕາມທີ່ Request
 * @param helpers - Helper functions
 * @param store - ຊື່ Store/Table
 * @param fixedFormat - ເປັນ ຂໍ້ມູນທີ່ມີການ fixed ມາແລ້ວ
 * @returns SQL Data || Object
 */

import { ValidAllDataFromService } from "@Store/models/store.respository.model";
import { DeleteQueryForMySQL, DeleteQueryForPostgreSQL } from "./Databases/delete";

/**
 * 
 * @function SQLmanagement
 * ສຳຫຼັບການຈັດການສົ່ງຄຳສັ່ງ Query (Helper)
 */

/**
 * 
 * @where - fixedFormat
 * ເປັນ Object ທີ່ເກັບ ຄຳສັ່ງທີ່ fixed ກັບ Placeholder ແລ້ວຈາກ Request ແລ້ວ
 * ເຊັ່ນ: id = ? | fields = ?
 */

/**
 * @params - fixedFormat
 * ເປັນ Array Object ທີ່ເກັບຄ່າທີ່ມາຈາກ Request ເພື່ອໄປໃຊ້ກັບ Placeholder
 */


const dbTypeDeleteRespository: any = {
    postgresql: async (data: any) => await DeleteQueryForPostgreSQL(data),
    mysql: async (data: any) => await DeleteQueryForMySQL(data)
}

export const DeleteSqlStoreRespo = (helpers: any) => async (dataFromResposCenter: ValidAllDataFromService) => {
    try {
        const { db_type, store, fixedFormat } = dataFromResposCenter;
        console.log('DeleteStoreRespo', db_type, store, fixedFormat);
        const { SQLmanagement } = helpers;

        const mappedData = await dbTypeDeleteRespository[db_type]({...fixedFormat, store});
        const {cmd, paramsQuery} = mappedData;

        const response = await SQLmanagement(db_type, { cmd, params: paramsQuery, isReturn: true });
        // console.log('DeleteStoreRespo (response): ', response);

        return response;
    } catch (error) {
        console.log('DeleteStoreRespo (Error):', error);
        throw error;
    }
}