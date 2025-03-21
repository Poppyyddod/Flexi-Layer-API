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
const IsGetLastRow = (where: any) => where && where.includes('ORDER BY');


/**
 * @function IsGetSomeRow - ກວດສອບວ່າ where ເປັນຮູບແບບການດືງບາງຊຸດຂໍ້ມູນ
 * @param where 
 * @returns 
 */
const IsGetSomeRow = (where: any) => where && where.includes('$');


/**
 * @function FetchQueryForPostgreSQL - ຄຳສັ່ງສຳຫຼັບ Fetch feature ຂອງ MySQL Database
 * @param data 
 * @returns 
 */
export const FetchQueryForPostgreSQL = (data: any) => {
    try {
        console.log('FetchQueryForPostgreSQL (data) : ', data);

        const { store, field_list, where, limit, params } = data;

        // const cmd = where === undefined ? // Get all row
        //     `SELECT ${field_list} FROM ${store} ${LimitFeature(limit)};`
        //     : IsGetLastRow(where) ? // Get the last row
        //         `SELECT ${field_list} FROM ${store} ${where} ${LimitFeature(limit)};`
        //         : IsGetSomeRow(where) ?// Get some row
        //             `SELECT ${field_list} FROM ${store} WHERE ${where} ${LimitFeature(limit)};`
        //             : 'Not match';

        const cmd = where === undefined ? // Get all row
            `SELECT ${field_list} FROM ${store} ${LimitFeature(limit)};`
            : IsGetLastRow(where) ? // Get the last row
                `SELECT ${field_list} FROM ${store} ${where} ${LimitFeature(limit)};`
                : IsGetSomeRow(where) || where.includes('IS NULL') ?// Get some row
                    `SELECT ${field_list} FROM ${store} WHERE ${where} ${LimitFeature(limit)};`
                    : 'Not match';

        console.log('FetchQueryForPostgreSQL (cmd) : ', cmd);

        if (cmd === 'Not match') {
            throw { kind: 'cmd_is_not_match_the_condition' };
        }

        const paramsToQuery = [...params];

        const dataToReturn = {
            cmd,
            paramsToQuery
        }

        console.log('FetchQueryForPostgreSQL (dataToReturn) : ', dataToReturn);

        return dataToReturn;
    } catch (error: any) {
        console.log('FetchQueryForMySQL (Error) : ', error);
        throw error;
    }
}