
/**
 * @function DeleteQueryForPostgreSQL ສຳຫຼັບການຈັດການຄຳສັ່ງກ່ອນ Query ຂອງ PostgreSQL
 * @param data 
 * @returns 
 */
export const DeleteQueryForPostgreSQL = async (data: any) => {
    try {
        const {where, params, store} = data;
        const cmd = `DELETE FROM ${store} WHERE ${where}`;
        const paramsQuery = [...params];

        return {cmd, paramsQuery};
    } catch (error: any) {
        console.log('DeleteStoreRespo (error)(PostgreSQL) : ', error);
        throw error;
    }
}