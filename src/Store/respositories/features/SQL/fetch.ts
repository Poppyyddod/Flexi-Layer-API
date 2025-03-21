/**
 * @function FetchStoreRespo - ສຳຫຼັບສື່ສານກັບ Database ໃຫ້ດືງຂໍ້ມູນຕາມທີ່ Request
 * @param helpers - Helper functions
 * @param store - ຊື່ Store/Table
 * @param fixedFormat - ເປັນ ຂໍ້ມູນທີ່ມີການ fixed ມາແລ້ວ
 * @returns SQL Data || Object
 */

import { ValidAllDataFromService } from "@Store/models/store.respository.model";
import { FetchQueryForMySQL, FetchQueryForPostgreSQL } from "./Databases/fetch";

/**
 * 
 * @function SQLmanagement
 * ສຳຫຼັບການຈັດການສົ່ງຄຳສັ່ງ Query (Helper)
 */

/**
 * 
 * @where <- fixedFormat
 * ເປັນ Object ທີ່ເກັບ ຄຳສັ່ງທີ່ fixed ກັບ Placeholder ແລ້ວຈາກ Request ແລ້ວ
 * ເຊັ່ນ: id = ? | fields = ?
 */

/**
 * @params <- fixedFormat
 * ເປັນ Array Object ທີ່ເກັບຄ່າທີ່ມາຈາກ Request ເພື່ອໄປໃຊ້ກັບ Placeholder
 */

const MappingQueryForSQL: any = {
    postgresql: FetchQueryForPostgreSQL,
    mysql: FetchQueryForMySQL
}

export const FetchSqlStoreRespo = (helpers: any) => async (dataFromResposCenter: any): Promise<any> => {
    try {
        const { SQLmanagement } = helpers;
        const { db_type, store, fixedFormat, limit } = dataFromResposCenter;

        console.log('- FetchStoreRespo : ', store, fixedFormat);

        delete dataFromResposCenter['where'];

        const dataToDbTypeMapping = {
            store,
            limit,
            ...fixedFormat
        };

        const mappedData = await MappingQueryForSQL[db_type](dataToDbTypeMapping);
        const { cmd, paramsToQuery } = mappedData;

        const response = await SQLmanagement(db_type, { cmd, params: paramsToQuery, isReturn: true });
        // console.log('FetchStoreRespo (response): ', response);

        return response;
    } catch (error) {
        // console.log('FetchStoreRespo (Error):', error);
        throw error;
    }
}
