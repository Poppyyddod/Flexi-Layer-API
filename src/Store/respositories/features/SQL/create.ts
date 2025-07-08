import { ValidAllDataFromService } from "@Store/models/store.respository.model";
import { CreateQueryForMySQL, CreateQueryForPostgreSQL } from "./Databases/create";

/**
 * @function CreateStoreRespo - ສຳຫຼັບເປັນເສັ້ນທາງການສົ່ງ Query ໄປທີ່ Database
 * @param helpers - Helper functions
 * @param store - ຊື່ Store/Table
 * @param fixedFormat - ເປັນ ຂໍ້ມູນທີ່ມີການ fixed ມາແລ້ວ
 * @returns SQL Data || Object
 */

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
    postgresql: async (data: any) => await CreateQueryForPostgreSQL(data),
    mysql: async (data: any) => await CreateQueryForMySQL(data)
};

export const CreateSqlStoreRespo = (helpers: any) => async (dataFromResposCenter: ValidAllDataFromService): Promise<any> => {
    try {
        console.log('> CreateStoreRespo : ');
        console.log('- Query data : ', dataFromResposCenter);
        const { SQLmanagement } = helpers;
        const { db_type, store, fixedFormat } = dataFromResposCenter;
        const { set, params } = fixedFormat;

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