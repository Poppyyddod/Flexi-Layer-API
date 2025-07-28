import { isObject } from "@Helper/Utils";

/**
 * @function LimitFeature - ສຳຫຼັບກວດສອບວ່າມີ Limit feature ບໍ
 * @param limit 
 * @returns 
 */
const LimitFeature = (limit: number) => limit === undefined ? '' : `LIMIT ${limit}`;


const JoinFeature = (join: string) => join === undefined ? '' : join;

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
export const FetchQueryForMySQL = (dataToQuery: any) => {
    try {
        const { store_code, field_list, where, limit, params, join } = dataToQuery;
        console.log('FetchQueryForMySQL (dataToQuery) : ', dataToQuery);

        let cmd;

        if (where === undefined) {
            cmd = `SELECT ${field_list} FROM ?? ${JoinFeature(join)} ${LimitFeature(limit)};`;
        } else if (IsGetLastRow(where)) {
            cmd = `SELECT ${field_list} FROM ${store_code} ${JoinFeature(join)} ${where} ${LimitFeature(limit)};`;
        } else if (IsGetSomeRow(where)) {
            cmd = `SELECT ${field_list} FROM ?? ${JoinFeature(join)} WHERE ${where} ${LimitFeature(limit)};`;
        } else {
            cmd = 'Not match';
        }

        // const cmd = where === undefined ? // Get all row
        //     `SELECT ${field_list} FROM ?? ${LimitFeature(limit)};`
        //     : IsGetLastRow(where) ? // Get the last row
        //         `SELECT ${field_list} FROM ${store_code} ${where} ${LimitFeature(limit)};`
        //         : IsGetSomeRow(where) ?
        //             `SELECT ${field_list} FROM ?? WHERE ${where} ${LimitFeature(limit)};`
        //             : 'Not match';

        console.log('FetchQueryForMySQL (cmd) : ', cmd);

        if (cmd === 'Not match') {
            throw { kind: 'cmd_is_not_match_the_condition' };
        }

        const paramsToQuery = [store_code, ...params];

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