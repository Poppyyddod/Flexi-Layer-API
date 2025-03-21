/**
 * @function EditStoreService - ສຳຫຼັບການເອີ້ນໃຊ້ Function ຕ່າງໆເພື່ອແກ້ໄຂຂໍ້ມູນ
 * @param helpers - Helper functions
 * @param request - ເປັນ Object ຂອງ Request body
 * @returns Object
 * @throws {Error}
 */

/**
 * 
 * @function CheckDataStructure
 * ສຳຫຼັບການກວດສອບ Store/Table, Fields ແລະ Data type ວ່າກົງຕາມທີ່ກຳໜົດແລ້ວ ຫຼື ບໍ
 */

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

/**
 * @function StoreRespository
 * ສຳຫຼັບການສື່ສານກັບ Database
 */

export const EditSqlStoreService = (helpers: any) => async (validRequestData: any): Promise<any> => {
    try {
        console.log('> EditStoreService :');
        const { FixRequestFormat, Supplier } = helpers;

        // Check Data 
        const { db_type, store, set, where } = validRequestData;
        console.log('- Request : ', validRequestData);

        const fixedFormat = await FixRequestFormat({...validRequestData, feature: 'update'});
        // console.log('EditStoreService (fixedFormat) : ', fixedFormat);

        const dataToServiceCenter = {
            db_type,
            store,
            fixedFormat
        };

        return dataToServiceCenter;
    } catch (error) {
        // console.log('EditStoreService (Error):', error);
        throw error;
    }
}