/**
 * @function FetchStoreService - ສຳຫຼັບການເອີ້ນໃຊ້ Function ຕ່າງໆເພື່ອດືງຂໍ້ມູນ
 * @param helpers - Helper functions
 * @param request - ເປັນ Object ຂອງ Request body
 * @returns Object
 * @throws {Error}
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

export const FetchSqlStoreService = (helpers: any) => async (validRequestData: any): Promise<any> => {
    try {
        console.log('> FetchStoreService :');
        console.log('Request : ', validRequestData);

        const { FixRequestFormat, Supplier } = helpers;

        // Checked Data Structure
        const { db_type, store, where, field_list } = validRequestData;

        // Fixed Request format to SQL query format
        const fixedFormat = await FixRequestFormat({...validRequestData, feature: 'select'});
        // console.log('FetchStoreService (fixedFormat) : ', fixedFormat);

        const dataToServiceCenter = {
            ...validRequestData,
            fixedFormat,
        };
        // console.log('FetchStoreService (dataToServiceCenter) :', dataToServiceCenter);

        return dataToServiceCenter;
    } catch (error) {
        // console.log('FetchStoreService (Error):', error);
        throw error;
    }
}