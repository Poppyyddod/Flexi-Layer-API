/**
 * @function FetchStoreService - ສຳຫຼັບການເອີ້ນໃຊ້ Function ຕ່າງໆເພື່ອດືງຂໍ້ມູນ
 * @param helpers - Helper functions
 * @param request - ເປັນ Object ຂອງ Request body
 * @returns Object
 * @throws {Error}
 */

import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { IStoreReturnToServiceCenter } from "@SRC/Store/models/store.controller.model";
import { CheckJoinFeature } from "@SRC/Store/utils/join.table";

/**
 * 
 * @function Supplier
 * ສຳຫຼັບການນັບຄ່າຈາກ Function ເສີມທີ່ຜູ້ໃຊ້ Libary ສ້າງຂື້ນ
 */

/**
 * 
 * @function FixRequestFormat
 * ສຳຫຼັບການປ່ຽນແປງ Request ເພື່ອສົ່ງໄປ Query ຢ່າງຖືກຕ້ອງຕາມທີ່ Request
 */

const JoinTableFeature = (helpers: any, validRequestData: IMyRequestData, fixedFormat: any) => {
    const { FixJoinFormatRequest } = helpers;

    const joinQuery = FixJoinFormatRequest(validRequestData);
    console.log('FetchStoreService (joinQuery) : ', joinQuery);
    if (joinQuery === "") throw { kind: 'invalid_join_structure' };

    fixedFormat.join = joinQuery;
}

export const FetchSqlStoreService = (helpers: any) => async (validRequestData: IMyRequestData): Promise<IStoreReturnToServiceCenter> => {
    try {
        console.log('> FetchStoreService :');
        console.log('Request : ', validRequestData);

        const { FixRequestFormat, FixJoinFormatRequest } = helpers;
        const { db_type, store_code } = validRequestData;

        // Fixed Request format to SQL query format
        const fixedFormat = await FixRequestFormat({ ...validRequestData, feature: 'select' });
        // console.log('FetchStoreService (fixedFormat) : ', fixedFormat);

        // IF EXIST `join` -> Check And Fix Join Feature
        if (validRequestData.join) {
            JoinTableFeature(helpers, validRequestData, fixedFormat);
        }

        const dataToServiceCenter: IStoreReturnToServiceCenter = {
            // ...validRequestData,
            db_type,
            store_code,
            fixedFormat,
        };
        // console.log('FetchStoreService (dataToServiceCenter) :', dataToServiceCenter);

        return dataToServiceCenter;
    } catch (error) {
        // console.log('FetchStoreService (Error):', error);
        throw error;
    }
}