/**
 * @function FetchStoreRespo - ສຳຫຼັບສື່ສານກັບ Database ໃຫ້ດືງຂໍ້ມູນຕາມທີ່ Request
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
 * 
 * @where - fixedFormat
 * ເປັນ Object ທີ່ເກັບ ຄຳສັ່ງທີ່ fixed ກັບ Placeholder ແລ້ວຈາກ Request ແລ້ວ
 * ເຊັ່ນ: id = ? | fields = ?
 */

/**
 * @params - fixedFormat
 * ເປັນ Array Object ທີ່ເກັບຄ່າທີ່ມາຈາກ Request ເພື່ອໄປໃຊ້ກັບ Placeholder
 */


const dbTypeRespository: any = {
    postgresql: (data: any) => {
        const cmd = data.where === undefined ?
            `SELECT * FROM ${data.store}`
            :
            `SELECT * FROM ${data.store} WHERE ${data.where}`;

        const paramsToQuery = [...data.params];

        const dataToReturn = {
            cmd,
            paramsToQuery
        }

        return dataToReturn;
    },

    mysql: (data: any) => {
        const cmd = data.where === undefined ?
            "SELECT * FROM ??"
            :
            `SELECT * FROM ?? WHERE ${data.where}`;

        const paramsToQuery = [data.store, ...data.params];

        const dataToReturn = {
            cmd,
            paramsToQuery
        }

        return dataToReturn;
    }
}

export const FetchSqlStoreRespo = (helpers: any) => async (dataFromResposCenter: ValidAllDataFromService): Promise<any> => {
    try {
        const { SQLmanagement } = helpers;
        const { db_type, store, fixedFormat } = dataFromResposCenter;

        console.log('- FetchStoreRespo : ', store, fixedFormat);

        const { where, params } = fixedFormat;

        const dataToDbTypeMapping = {
            where, params, store
        };

        const mappedData = dbTypeRespository[db_type](dataToDbTypeMapping);
        const { cmd, paramsToQuery } = mappedData;

        // const cmd = where === undefined ?
        //     "SELECT * FROM ??"
        //     :
        //     `SELECT * FROM ?? WHERE ${where}`;

        // const paramsQuery = [store, ...params];
        // console.log('paramsQuery (EditStoreRespo) : ', paramsQuery);

        const response = await SQLmanagement(db_type, { cmd, params: paramsToQuery, isReturn: true });
        // console.log('FetchStoreRespo (response): ', response);

        return response;
    } catch (error) {
        // console.log('FetchStoreRespo (Error):', error);
        throw error;
    }
}
