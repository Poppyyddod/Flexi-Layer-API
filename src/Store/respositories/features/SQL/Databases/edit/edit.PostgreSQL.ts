
/**
 * @function EditQueryForMySQL ສຳຫຼັບການຈັດການຄຳສັ່ງກ່ອນສົ່ງໄປ Query ຂອງ PostgreSQL
 * @param fixedFormat - Object
 * @returns - Object
 */
export const EditQueryForPostgreSQL = async (fixedFormat: any) => {
    try {
        const { set, where, params, store } = fixedFormat;

        const cmd = `UPDATE ${store} SET ${set} WHERE ${where}`;
        const paramsQuery = [...params];

        return {
            cmd,
            paramsQuery
        }
    } catch (error: any) {
        console.log('EditStoreRespo (error)(PostgreSQL) : ', error);
        throw error;
    }
}