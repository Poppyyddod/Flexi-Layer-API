import { IFixedToQueryFormat } from "@SRC/Store/models/store.controller.model";

/**
 * @function EditQueryForMySQL ສຳຫຼັບການຈັດການຄຳສັ່ງກ່ອນສົ່ງໄປ Query ຂອງ MySQL
 * @param fixedFormat - Object
 * @returns - Object
 */
export const EditQueryForMySQL = async (fixedFormat: IFixedToQueryFormat, store_code: string) => {
    try {
        const { set, where, params } = fixedFormat;

        const cmd = `UPDATE ?? SET ${set} WHERE ${where}`;
        console.log('EditStoreRespo (cmd) : ', cmd);

        const paramsQuery = [store_code, ...params];

        return {
            cmd,
            paramsQuery
        }
    } catch (error: any) {
        console.log('EditStoreRespo (error)(MySQL) : ', error);
        throw error;
    }
}