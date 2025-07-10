import { IFixedToQueryFormat } from "@SRC/Store/models/store.controller.model";

/**
 * @function DeleteQueryForPostgreSQL ສຳຫຼັບການຈັດການຄຳສັ່ງກ່ອນ Query ຂອງ MySQL
 * @param data 
 * @returns 
 */
export const DeleteQueryForMySQL = async (fixedFormat: IFixedToQueryFormat, store_code: string) => {
    try {
        const { where, params } = fixedFormat;
        const cmd = `DELETE FROM ?? WHERE ${where}`;
        const paramsQuery = [store_code, ...params];

        return { cmd, paramsQuery };
    } catch (error) {
        console.log('DeleteStoreRespo (error)(MySQL) : ', error);
        throw error;
    }
}