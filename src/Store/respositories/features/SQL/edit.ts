/**
 * @function EditStoreRespo - ສຳຫຼັບສື່ສານກັບ Database ໃຫ້ແກ້ໄຂຂໍ້ມູນຕາມທີ່ Request
 * @param helpers - Helper functions
 * @param store - ຊື່ Store/Table
 * @param fixedFormat - ເປັນ ຂໍ້ມູນທີ່ມີການ fixed ມາແລ້ວ
 * @returns SQL Data || Object
 */

import { ValidAllDataFromService } from "@Store/models/store.respository.model";
import { EditQueryForMySQL } from "./Databases/edit";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { IFixedToQueryFormat } from "@SRC/Store/models/store.controller.model";
import { IStoreFeatureList } from "@SRC/Store/models/store.global.model";

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
    mysql: async (fixedFormat: IFixedToQueryFormat, store_code: string) => await EditQueryForMySQL(fixedFormat, store_code)
}


export const EditSqlStoreRespo = (helpers: any) => async (validRequestData: IMyRequestData, fixedFormat: IFixedToQueryFormat, feature: IStoreFeatureList) => {
    try {
        const { SQLmanagement } = helpers;
        const { db_type, store_code } = validRequestData;

        console.log('EditStoreRespo', store_code, db_type);
        console.log('Set : ', fixedFormat.set);
        console.log('Fixed Params : ', fixedFormat.params);

        const mappedData = await dbTypeEditRespository[db_type](fixedFormat, store_code);
        const { cmd, paramsQuery } = mappedData;

        // console.log('mappedData (EditStoreRespo) : ', mappedData);

        const response = await SQLmanagement(db_type, { cmd, params: paramsQuery, isReturn: true });
        // console.log('EditStoreRespo (response) : ', response);

        return response;
    } catch (error) {
        // console.log('EditStoreRespo (Error):', error);
        throw error;
    }
}