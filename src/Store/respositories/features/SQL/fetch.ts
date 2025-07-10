/**
 * @function FetchStoreRespo - ສຳຫຼັບສື່ສານກັບ Database ໃຫ້ດືງຂໍ້ມູນຕາມທີ່ Request
 * @param helpers - Helper functions
 * @param store - ຊື່ Store/Table
 * @param fixedFormat - ເປັນ ຂໍ້ມູນທີ່ມີການ fixed ມາແລ້ວ
 * @returns SQL Data || Object
 */

import { IStoreFeatureList } from "@SRC/Store/models/store.global.model";
import { FetchQueryForMySQL } from "./Databases/fetch";
import { IFixedToQueryFormat } from "@SRC/Store/models/store.controller.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";

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
    mysql: FetchQueryForMySQL
}

export const FetchSqlStoreRespo = (helpers: any) => async (validRequestData: IMyRequestData, fixedFormat: IFixedToQueryFormat, feature: IStoreFeatureList): Promise<any> => {
    try {
        const { SQLmanagement } = helpers;
        const { db_type, store_code, limit } = validRequestData;

        console.log('- FetchStoreRespo : ', store_code, fixedFormat);

        delete validRequestData['where'];

        const dataToDbTypeMapping = {
            store_code,
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
