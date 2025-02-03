import { SQLmanagement } from "@Helper/Query/SQL";

export const FetchStoreRespo = async (store: string, fixedFormat: any): Promise<any> => {
    try {
        console.log('FetchStoreRespo', store, fixedFormat);
        const { fields, params } = fixedFormat;
        const cmd = fields === null ?
            "SELECT * FROM ??"
            :
            `SELECT * FROM ?? WHERE ${fields}`;

        const paramsQuery = [store, params];
        // console.log('paramsQuery (EditStoreRespo) : ', paramsQuery);

        const response = await SQLmanagement({ cmd, params: paramsQuery, isReturn: true });
        // console.log('FetchStoreRespo (response): ', response);

        return response;
    } catch (error) {
        console.log('FetchStoreRespo (Error):', error);
        throw error;
    }
}


export const CreateStoreRespo = async (store: string, fixedFormat: any): Promise<any> => {
    try {
        // console.log('CreateStoreRespo', store, fixedFormat);
        const { fields, params } = fixedFormat;

        const insertCMD = `INSERT INTO ?? SET ${fields}`;
        const newRecord = await SQLmanagement({ cmd: insertCMD, params: [store, params], isReturn: true });
        // console.log('CreateStoreRespo (newRecordId): ', newRecord);

        const selectCMD = `SELECT * FROM ?? WHERE id = ?`;
        const newData = await SQLmanagement({ cmd: selectCMD, params: [store, newRecord.insertId], isReturn: true });
        // console.log('CreateStoreRespo (new record data): ', newData);

        return newData;
    } catch (error) {
        console.log('CreateStoreRespo (Error):', error);
        throw error;
    }
}


export const EditStoreRespo = async (store: string, set: any, fixedFormat: any) => {
    try {
        const { fields, params } = fixedFormat;
        // console.log('EditStoreRespo', store);
        // console.log('Set : ', set);
        // console.log('Fixed Params : ', params);

        const cmd = `UPDATE ?? SET ? WHERE ${fields}`;
        // console.log('EditStoreRespo (cmd) : ', cmd);

        const paramsQuery = [store, set, params];
        // console.log('paramsQuery (EditStoreRespo) : ', paramsQuery);

        const response = await SQLmanagement({ cmd, params: paramsQuery, isReturn: true });
        // console.log('EditStoreRespo (response) : ', response);

        return response;
    } catch (error) {
        console.log('EditStoreRespo (Error):', error);
        throw error;
    }
}


export const RemoveStoreRespo = async (store: string, fixedFormat: any) => {
    try {
        // console.log('RemoveStoreRespo', store, fixedFormat);

        const { fields, params } = fixedFormat;
        const cmd = `DELETE FROM ?? WHERE ${fields}`;
        const response = await SQLmanagement({ cmd, params: [store, params], isReturn: true });
        // console.log('RemoveStoreRespo (response): ', response);

        return response;
    } catch (error) {
        console.log('RemoveStoreRespo (Error):', error);
        throw error;
    }
}
