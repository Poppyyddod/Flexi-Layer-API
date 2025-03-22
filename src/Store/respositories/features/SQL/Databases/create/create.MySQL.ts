
/**
 * @function GetPrimaryKeyFieldName ສຳຫຼັບການດືງເອົາ Primary key field
 * @param data - Object
 * @returns - Array
 */
const GetPrimaryKeyFieldName = async (data: any) => {
    try {
        const { SQLmanagement, store, db_type } = data;

        const getPrimaryKeyfieldnameCmd = `SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
        AND COLUMN_KEY = 'PRI'`;

        const response = await SQLmanagement(db_type, { cmd: getPrimaryKeyfieldnameCmd, params: [store], isReturn: true });
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
export const CreateQueryForMySQL = async (data: any) => {
    try {
        console.log('CreateQueryForMySQL (data) : ', data);
        const { SQLmanagement, set, params, store, db_type } = data;

        const insertCMD = `INSERT INTO ?? ${set}`;
        const newRecord = await SQLmanagement(db_type, { cmd: insertCMD, params: [store, ...params], isReturn: true });
        console.log('CreateStoreRespo (newRecordId): ', newRecord);

        const primaryKeyData = await GetPrimaryKeyFieldName(data);

        // const selectCMD = `SELECT * FROM ?? WHERE ${primaryKeyData[0]?.COLUMN_NAME} = ?`;
        const splitedValuesFromString = insertCMD.split('VALUES ');
        const lengthParamsForLimit = splitedValuesFromString[1].split('(').length - 1;

        const selectCMD = `SELECT * FROM ?? ${primaryKeyData[0]?.COLUMN_NAME} ORDER BY ${primaryKeyData[0]?.COLUMN_NAME} DESC LIMIT ${lengthParamsForLimit}`;
        const newData = await SQLmanagement(db_type, { cmd: selectCMD, params: [store, newRecord.insertId], isReturn: true });
        console.log('CreateStoreRespo (new record data): ', newData);

        return newData;
    } catch (error: any) {
        console.log('CreateStoreRespo (error)(MySQL) : ', error);
        throw error;
    }
}