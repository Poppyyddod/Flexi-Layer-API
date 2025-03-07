/**
 * @function CreateStoreRespo - ສຳຫຼັບສື່ສານກັບ Database ໃຫ້ Record ຂໍ້ມູນຕາມທີ່ Request
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
 * @set - fixedFormat
 * ເປັນ Object ທີ່ເກັບ ຄຳສັ່ງທີ່ fixed ກັບ Placeholder ແລ້ວຈາກ Request ແລ້ວ
 * ເຊັ່ນ: id = ? | fields = ?
 */

/**
 * @params - fixedFormat
 * ເປັນ Array Object ທີ່ເກັບຄ່າທີ່ມາຈາກ Request ເພື່ອໄປໃຊ້ກັບ Placeholder
 */

const dbTypeCreateStoreRespository: any = {
    postgresql: async (data: any) => {
        const { SQLmanagement, set, params, store, db_type } = data;

        const fields = set.split(', ').map((pair: any) => pair.split(' = ')[0]).join(', ');
        const placeholders = set.split(', ').map((pair: any) => pair.split(' = ')[1]).join(', ');

        const cmd = `INSERT INTO ${store} (${fields}) VALUES (${placeholders}) RETURNING *;`;
        console.log('CreateStoreRespo (PostgreSQL)(cmd) : ', cmd);

        const newRecordData = await SQLmanagement(db_type, { cmd, params, isReturn: true });
        console.log('CreateStoreRespo (PostgreSQL)(newRecord): ', newRecordData);

        return newRecordData;
    },

    mysql: async (data: any) => {
        try {
            const { SQLmanagement, set, params, store, db_type } = data;

            const insertCMD = `INSERT INTO ?? SET ${set}`;
            const newRecord = await SQLmanagement(db_type, { cmd: insertCMD, params: [store, ...params], isReturn: true });
            console.log('CreateStoreRespo (newRecordId): ', newRecord);

            const fixForPrimaryKey = store === "user_privacy" ? "user_id" : `${store}_id`;
            console.log('CreateStoreRespo (fixForAuth) : ', fixForPrimaryKey);

            const getPrimaryKeyfieldnameCmd = `SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
            AND COLUMN_KEY = 'PRI'`;

            const primaryKey = await SQLmanagement(db_type, { cmd: getPrimaryKeyfieldnameCmd, params: [store], isReturn: true });
            console.log('primaryKey : ', primaryKey);

            const selectCMD = `SELECT * FROM ?? WHERE ${primaryKey[0]?.COLUMN_NAME} = ?`;
            const newData = await SQLmanagement(db_type, { cmd: selectCMD, params: [store, newRecord.insertId], isReturn: true });
            console.log('CreateStoreRespo (new record data): ', newData);

            return newData;
        } catch (error: any) {
            console.log('CreateStoreRespo (error) : ', error);

            //// Old checking error
            // if (error?.sqlState === '42S22' && error?.code === 'ER_BAD_FIELD_ERROR') {
            //     throw { kind: 'mysql_insert_table_name_id_is_not_valid' };
            // }

            throw error;
        }
    }
};

export const CreateSqlStoreRespo = (helpers: any) => async (dataFromResposCenter: ValidAllDataFromService): Promise<any> => {
    try {
        console.log('> CreateStoreRespo : ');
        console.log('- Query data : ', dataFromResposCenter);
        const { SQLmanagement } = helpers;
        const { db_type, store, fixedFormat } = dataFromResposCenter;
        const { set, params } = fixedFormat;

        // const hasIdField = fixedFormat['set'].includes("id");
        // console.log("has ID field?? : ", hasIdField);

        const dataToQuery = {
            db_type,
            store,
            set,
            params,
            SQLmanagement
        };

        const dataToReturn = await dbTypeCreateStoreRespository[db_type](dataToQuery);

        return dataToReturn;
    } catch (error: any) {
        console.log('CreateStoreRespo (Error):', error);
        throw error;
    }
}