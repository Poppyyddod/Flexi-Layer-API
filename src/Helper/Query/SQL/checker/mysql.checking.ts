/**
 * @function CheckResponseMySqlData - For check `MySQL` response data
 * @param cmd - String # SQL Command
 * @param params - Array # Request Array data to query
 * @param sqlData - Key # `MySQL` response data
 * @param isReturn - Boolean # Return with `data` or `boolean`
 * @returns - Array Object / Key Object / Boolean
 * @throws {Error}
 */




export const CheckResponseMySqlData = async (cmd: string, params: any, sqlData: any, isReturn: boolean): Promise<any> => {
    try {
        console.log('CheckResponseSqlData : ', params, sqlData);

        const cmdType = cmd.split(' ')[0];
        console.log('CheckResponseSqlData (cmdType) : ', cmdType);

        const notFoundData = {
            first: 'affectedRows' in sqlData && sqlData.affectedRows === 0,
            second: cmdType === "SELECT" && params.length > 1 && sqlData.length === 0
        }

        // console.log('notFoundData : ', notFoundData);

        if (notFoundData.first || notFoundData.second) {
            throw { kind: 'not_found_data' };
        }

        if (Array.isArray(sqlData) && sqlData.length === 0) {
            return { kind: 'null_data' };
        }

        const dataToReturn = isReturn ? sqlData : true;

        return dataToReturn
    } catch (error) {
        console.log('CheckingStore (Error):', error);
        throw error;
    }
}