
/**
 * @function EditQueryForMySQL ສຳຫຼັບການຈັດການຄຳສັ່ງກ່ອນສົ່ງໄປ Query ຂອງ MySQL
 * @param fixedFormat - Object
 * @returns - Object
 */
export const EditQueryForMySQL = async (fixedFormat: any) => {
    try {
        const { set, where, params, store } = fixedFormat;

        const cmd = `UPDATE ?? SET ${set} WHERE ${where}`;
        console.log('EditStoreRespo (cmd) : ', cmd);

        const paramsQuery = [store, ...params];

        return {
            cmd,
            paramsQuery
        }
    } catch (error: any) {
        console.log('EditStoreRespo (error)(MySQL) : ', error);
        throw error;
    }
}