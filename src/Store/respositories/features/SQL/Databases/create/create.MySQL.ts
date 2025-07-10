import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { IFixedToQueryFormat } from "@SRC/Store/models/store.controller.model";

/**
 * @function GetPrimaryKeyFieldName ສຳຫຼັບການດືງເອົາ Primary key field
 * @param data - Object
 * @returns - Array
 */
const GetPrimaryKeyFieldName = async (
    SQLmanagement: any,
    validRequestData: IMyRequestData
) => {
    try {
        const { store_code, db_type } = validRequestData;

        const getPrimaryKeyfieldnameCmd = `SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
        AND COLUMN_KEY = 'PRI'`;

        const response = await SQLmanagement(db_type, { cmd: getPrimaryKeyfieldnameCmd, params: [store_code], isReturn: true });
        console.log('primaryKey : ', response);

        return response
    } catch (error: any) {
        console.log('CreateStoreRespo (error)(GetPrimaryKeyFieldName) : ', error);
        throw error;
    }
}

/**
 * @function CreateQueryForMySQL ສຳຫຼັບການສົ່ງ Query ໄປທີ່ MySQL
 * @param data 
 * @returns 
 */
export const CreateQueryForMySQL = async (
    SQLmanagement: any,
    validRequestData: IMyRequestData,
    fixedFormat: IFixedToQueryFormat
) => {
    try {
        console.log('CreateQueryForMySQL (data) : ', validRequestData, fixedFormat);
        const { set, params } = fixedFormat;
        const { store_code, db_type } = validRequestData;

        const insertCMD = `INSERT INTO ?? ${set}`;
        const newRecord = await SQLmanagement(db_type, { cmd: insertCMD, params: [store_code, ...params], isReturn: true });
        console.log('CreateStoreRespo (newRecordId): ', newRecord);

        const primaryKeyData = await GetPrimaryKeyFieldName(SQLmanagement, validRequestData);

        // const selectCMD = `SELECT * FROM ?? WHERE ${primaryKeyData[0]?.COLUMN_NAME} = ?`;
        const splitedValuesFromString = insertCMD.split('VALUES ');
        const lengthParamsForLimit = splitedValuesFromString[1].split('(').length - 1;

        const selectCMD = `SELECT * FROM ?? ${primaryKeyData[0]?.COLUMN_NAME} ORDER BY ${primaryKeyData[0]?.COLUMN_NAME} DESC LIMIT ${lengthParamsForLimit}`;
        const newData = await SQLmanagement(db_type, { cmd: selectCMD, params: [store_code, newRecord.insertId], isReturn: true });
        console.log('CreateStoreRespo (new record data): ', newData);

        return newData;
    } catch (error: any) {
        console.log('CreateStoreRespo (error)(MySQL) : ', error);
        throw error;
    }
}