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
        const {SQLmanagement, set, params, store, db_type} = data;

        const fields = set.split(', ').map((pair: any) => pair.split(' = ')[0]).join(', ');
        const placeholders = set.split(', ').map((pair: any) => pair.split(' = ')[1]).join(', ');

        const cmd = `INSERT INTO ${store} (${fields}) VALUES (${placeholders}) RETURNING *;`;
        console.log ('CreateStoreRespo (PostgreSQL)(cmd) : ', cmd);

        const newRecordData = await SQLmanagement(db_type, { cmd, params, isReturn: true });
        console.log('CreateStoreRespo (PostgreSQL)(newRecord): ', newRecordData);

        return newRecordData;
    },

    mysql: async (data: any) => {
        const {SQLmanagement, set, params, store, db_type} = data;

        const insertCMD = `INSERT INTO ?? SET ${set}`;
        const newRecord = await SQLmanagement(db_type, { cmd: insertCMD, params: [store, ...params], isReturn: true });
        console.log('CreateStoreRespo (newRecordId): ', newRecord);
        

        const fixForAuth = store === "user_signin_history" ? "user_signin_history_id" : "user_id";
        console.log('CreateStoreRespo (fixForAuth) : ', fixForAuth);

        const selectCMD = `SELECT * FROM ?? WHERE ${fixForAuth} = ?`;
        const newData = await SQLmanagement(db_type, { cmd: selectCMD, params: [store, newRecord.insertId], isReturn: true });
        console.log('CreateStoreRespo (new record data): ', newData);

        return newData;
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
    } catch (error) {
        console.log('CreateStoreRespo (Error):', error);
        throw error;
    }
}