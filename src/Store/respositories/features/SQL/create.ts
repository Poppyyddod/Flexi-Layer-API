import { ValidAllDataFromService } from "@Store/models/store.respository.model";
import { CreateQueryForMySQL } from "./Databases/create";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { IFixedToQueryFormat } from "@SRC/Store/models/store.controller.model";
import { IStoreFeatureList } from "@SRC/Store/models/store.global.model";

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
    mysql: async (
        SQLmanagement: any,
        validRequestData: IMyRequestData,
        fixedFormat: IFixedToQueryFormat
    ) => await CreateQueryForMySQL(SQLmanagement, validRequestData, fixedFormat)
};

export const CreateSqlStoreRespo = (helpers: any) => async (validRequestData: IMyRequestData, fixedFormat: IFixedToQueryFormat, feature: IStoreFeatureList): Promise<any> => {
    try {
        console.log('> CreateStoreRespo : ');
        console.log('- Query data : ', validRequestData);
        const { SQLmanagement } = helpers;
        const { db_type, store_code } = validRequestData;
        const { set, params } = fixedFormat;

        const dataToQuery = {
            db_type,
            store_code,
            set,
            params,
            SQLmanagement
        };

        const dataToReturn = await dbTypeCreateStoreRespository[db_type](SQLmanagement, validRequestData, fixedFormat);

        return dataToReturn;
    } catch (error: any) {
        console.log('CreateStoreRespo (Error):', error);
        throw error;
    }
}