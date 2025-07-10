/**
 * @function DeleteStoreRespo - ສຳຫຼັບສື່ສານກັບ Database ໃຫ້ລົບຂໍ້ມູນຕາມທີ່ Request
 * @param helpers - Helper functions
 * @param store - ຊື່ Store/Table
 * @param fixedFormat - ເປັນ ຂໍ້ມູນທີ່ມີການ fixed ມາແລ້ວ
 * @returns SQL Data || Object
 */

import { ValidAllDataFromService } from "@Store/models/store.respository.model";
import { DeleteQueryForMySQL } from "./Databases/delete";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { IFixedToQueryFormat } from "@SRC/Store/models/store.controller.model";
import { IStoreFeatureList } from "@SRC/Store/models/store.global.model";

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
    mysql: async (fixedFormat: IFixedToQueryFormat, store_code: string) => await DeleteQueryForMySQL(fixedFormat, store_code)
}

export const DeleteSqlStoreRespo = (helpers: any) => async (validRequestData: IMyRequestData, fixedFormat: IFixedToQueryFormat, feature: IStoreFeatureList) => {
    try {
        const { db_type, store_code } = validRequestData;
        console.log('DeleteStoreRespo', db_type, store_code, fixedFormat);
        const { SQLmanagement } = helpers;

        const mappedData = await dbTypeDeleteRespository[db_type](fixedFormat, store_code);
        const { cmd, paramsQuery } = mappedData;

        const response = await SQLmanagement(db_type, { cmd, params: paramsQuery, isReturn: true });
        // console.log('DeleteStoreRespo (response): ', response);

        return response;
    } catch (error) {
        console.log('DeleteStoreRespo (Error):', error);
        throw error;
    }
}