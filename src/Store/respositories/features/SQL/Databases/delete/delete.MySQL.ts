
/**
 * @function DeleteQueryForPostgreSQL ສຳຫຼັບການຈັດການຄຳສັ່ງກ່ອນ Query ຂອງ MySQL
 * @param data 
 * @returns 
 */
export const DeleteQueryForMySQL = async (data: any) => {
    try {
        const { where, params, store } = data;
        const cmd = `DELETE FROM ?? WHERE ${where}`;
        const paramsQuery = [store, ...params];

        return { cmd, paramsQuery };
    } catch (error) {
        console.log('DeleteStoreRespo (error)(MySQL) : ', error);
        throw error;
    }
}