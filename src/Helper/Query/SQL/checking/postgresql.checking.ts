import { listCmdType } from "./list.cmd.type";




/**
 * @function CheckResponsePosgreSqlData - For check `PostgreSQL` response data
 * @param cmd - String # SQL Command
 * @param params - Array # Request Array data to query
 * @param sqlData - Key # `PostgreSQL` response data
 * @param isReturn - Boolean # Return with `data` or `boolean`
 * @returns - Array Object / Key Object / Boolean
 * @throws {Error}
 */

export const CheckResponsePosgreSqlData = async (cmd: string, params: any, sqlData: any, isReturn: boolean): Promise<any> => {
    try {
        console.log('CheckResponsePosgreSqlData : ', params.length);

        const notFoundData = {
            first: listCmdType.affect.includes(sqlData.command) && 'rowCount' in sqlData && sqlData.rowCount === 0,
            second: listCmdType.affect_data.includes(sqlData.command) && (params.length > 0 || cmd.includes('IS NULL')) && 'rowCount' in sqlData && sqlData.rowCount === 0
        };
        // console.log('CheckResponsePosgreSqlData (notFoundData) : ', notFoundData);

        if (notFoundData.first || notFoundData.second) {
            throw { kind: 'not_found_data' };
        }

        if (listCmdType.data.includes(sqlData.command)) {
            if (Array.isArray(sqlData.rows) && sqlData.rows.length === 0) {
                return { kind: 'null_data' };
            }

            if (isReturn) {
                // console.log('CheckResponsePosgreSqlData (Rows count):', sqlData.rows.length);
                return sqlData.rows;
            }
        }

        if (isReturn && listCmdType.affect.includes(sqlData.command)) {
            // console.log('CheckResponsePosgreSqlData (affectedRows):', sqlData.rowCount);
            return { affectedRows: sqlData.rowCount };
        }

        return true;
    } catch (error) {
        console.log('CheckingStore (Error):', error);
        throw error;
    }
};