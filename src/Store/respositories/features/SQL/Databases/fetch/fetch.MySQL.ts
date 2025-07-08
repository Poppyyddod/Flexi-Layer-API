import { isObject } from "@Helper/Utils";

/**
 * @function LimitFeature - ສຳຫຼັບກວດສອບວ່າມີ Limit feature ບໍ
 * @param limit 
 * @returns 
 */
const LimitFeature = (limit: any) => limit === undefined ? '' : `LIMIT ${limit}`;

/**
 * @function IsGetLastRow - ກວດສອບວ່າ where ເປັນຮູບແບບການດືງຂໍ້ມູນສຸດທ້າຍຫຼືບໍ
 * @param where 
 * @returns 
 */
const IsGetLastRow = (where: any) => where.includes('ORDER BY');

/**
 * @function IsGetSomeRow - ກວດສອບວ່າ where ເປັນຮູບແບບການດືງບາງຊຸດຂໍ້ມູນ
 * @param where 
 * @returns 
 */
const IsGetSomeRow = (where: any) => where && where.includes('?');

/**
 * @function FetchQueryForPostgreSQL - ຄຳສັ່ງສຳຫຼັບ Fetch feature ຂອງ PostgreSQL Database
 * @param data 
 * @returns 
 */
export const FetchQueryForMySQL = (data: any) => {
    try {
        const { store, field_list, where, limit, params } = data;
        console.log('FetchQueryForMySQL (data) : ', data);

        const cmd = where === undefined ? // Get all row
            `SELECT ${field_list} FROM ?? ${LimitFeature(limit)};`
            : IsGetLastRow(where) ? // Get the last row
                `SELECT ${field_list} FROM ${store} ${where} ${LimitFeature(limit)};`
                : IsGetSomeRow(where) ?
                `SELECT ${field_list} FROM ?? WHERE ${where} ${LimitFeature(limit)};`
                : 'Not match';

        console.log('FetchQueryForMySQL (cmd) : ', cmd);

        if (cmd === 'Not match') {
            throw { kind: 'cmd_is_not_match_the_condition' };
        }

        const paramsToQuery = [store, ...params];

        const dataToReturn = {
            cmd,
            paramsToQuery
        }

        // console.log('FetchQueryForMySQL (dataToReturn) : ', dataToReturn);

        return dataToReturn;
    } catch (error: any) {
        console.log('FetchQueryForMySQL (Error) : ', error);
        throw error;
    }
}