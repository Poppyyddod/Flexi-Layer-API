import dotenv from 'dotenv';
dotenv.config();

import { isArray, isObject, isString } from '@Helper/Utils';
import { ObjectId } from 'mongodb';
import { FixMySQLRequestFormat } from './FixRequestFormat/Databases';
import { GetCachedTables, GetCachedTableStructure } from '@Helper/Cache';
import { IMySQLTableStructure } from '@SRC/Helper/Model/global.model';


/**
 * @function StoreMapping - ສຳຫຼັບການກວດສອບຂອງ Store/Table name
 * @param code - ລະຫັດຂອງ Store
 * @returns {String} - Store/Table name
 */


export const StoreMapping = async (db_type: string, storeCode: string): Promise<string> => {
    try {
        console.log('StoreMapping (db_type):', db_type);
        console.log('StoreMapping (store):', storeCode);

        // console.log('StoreMapping (cachedTables):', gotCachedTables);
        // console.log('StoreMapping (cachedTableStructure):', cachedTableStructure);

        const findedStoreCode = GetCachedTables().find((store: string) => store === storeCode);
        if (!findedStoreCode) throw { kind: 'invalid_store_code' };
        console.log('StoreMapping (findedStoreCode) : ', findedStoreCode);

        return findedStoreCode;
    } catch (error) {
        console.log('StoreMapping (Error):', error);
        throw error;
    }
};


type RequestFormat = {
    set?: Record<string, any> | any[];
    where?: Record<string, any> | string;
    db_type: string;
    field_list?: string | string[];
    feature?: string;
    store_code: string;
    params?: any[];
};

export const FixRequestFormat = async (request: RequestFormat | null | undefined) => {
    try {
        if (!request) return { params: [], fields: null };

        const { set, where, db_type, store_code, field_list, feature } = request;
        const params: any[] = [];
        const result: Partial<RequestFormat> = {};

        console.log("set !!!!!!!!!! : ", result);
        if (set && (isObject(set) || Array.isArray(set))) {
            const whereLength = isObject(where) ? Object.keys(where!).length : 0;
            const { fields, params: setParams } = CreateFieldAndParams(db_type, set, whereLength, feature!, 'set');
            result.set = fields;
            params.push(...setParams);
        }

        console.log("where !!!!!!!!!! : ", result);
        if (where && (isObject(where))) {
            const setLength = isObject(set) ? Object.keys(set!).length : 0;
            const { fields, params: whereParams } = CreateFieldAndParams(db_type, where, setLength, feature!, 'where');
            result.where = fields;
            params.push(...whereParams);
        }

        // Special case: fetch:last
        console.log("special case !!!!!!!!!! : ", result);
        if (typeof where === 'string') {
            const [primaryKey, typeValue] = where.split(':');
            console.log('FixRequestFormat (splittedWhere):', primaryKey, typeValue);

            // if (typeValue !== 'LAST') throw { kind: 'incomplete_request' };
            result.where = `ORDER BY ${primaryKey} DESC`;
        }

        if (field_list) {
            result.field_list = Array.isArray(field_list) ? field_list.join(', ') : field_list;
        }

        return { ...result, params };
    } catch (error: any) {
        console.error('FixRequestFormat (Error):', error?.message ?? error);
        throw error;
    }
};

const dbTypeCreateFieldAndParams: Record<string, (dataToFix: any) => { fields: any; params: any[] }> = {
    mysql: (dataToFix) => FixMySQLRequestFormat(dataToFix),
};

const CreateFieldAndParams = (
    db_type: string,
    obj: any,
    beforeObjLength: number,
    feature: string,
    reqKey: string
) => {
    const dataToFix = { obj, beforeObjLength, feature, reqKey };
    const handler = dbTypeCreateFieldAndParams[db_type];
    if (!handler) throw new Error(`Unsupported db_type: ${db_type}`);
    return handler(dataToFix);
};


// type RequestFormat = {
//     set?: Record<string, any> | any[];
//     where?: Record<string, any> | string;
//     db_type: string;
//     field_list?: string | string[];
//     feature?: string;
//     params?: any[];
// };

// export const FixRequestFormat = async (request: RequestFormat | null | undefined) => {
//     try {
//         if (!request) {
//             return { params: [], fields: null };
//         }

//         const { set, where, db_type, field_list, feature } = request;
//         request.params = [];

//         const dataToReturn: Partial<RequestFormat> = {};

//         if (set && (isObject(set) || Array.isArray(set))) {
//             const whereLength = where && typeof where === 'object' ? Object.keys(where).length : 0;
//             const fixedSet = CreateFieldAndParams(db_type, set, whereLength, feature!, 'set');

//             request.set = fixedSet.fields;
//             request.params.push(...fixedSet.params);
//             dataToReturn.set = fixedSet.fields;
//             dataToReturn.params = request.params;
//         }

//         if (where && (isObject(where) || typeof where === 'string')) {
//             const setLength = set && typeof set === 'object' ? Object.keys(set).length : 0;
//             const fixedWhere = CreateFieldAndParams(db_type, where, setLength, feature!, 'where');

//             request.where = fixedWhere.fields;
//             request.params.push(...fixedWhere.params);
//             dataToReturn.where = fixedWhere.fields;
//             dataToReturn.params = request.params;
//         }

//         if (typeof where === 'string' && feature === 'fetch') {
//             const [primaryKeyField, paramValue] = where.split(':');

//             if (paramValue !== 'LAST') {
//                 throw { kind: 'incomplete_request' };
//             }

//             dataToReturn.where = `ORDER BY ${primaryKeyField} DESC`;
//         }

//         if (field_list) {
//             if (Array.isArray(field_list)) {
//                 const formattedFieldList = field_list.join(', ');
//                 request.field_list = formattedFieldList;
//                 dataToReturn.field_list = formattedFieldList;
//             } else if (typeof field_list === 'string') {
//                 dataToReturn.field_list = field_list;
//             }
//         }

//         return {
//             params: request.params,
//             ...dataToReturn,
//         };
//     } catch (error: any) {
//         console.error('FixRequestFormat (Error):', error?.message ?? error);
//         throw error;
//     }
// };

// const dbTypeCreateFieldAndParams: Record<string, (dataToFix: any) => { fields: any; params: any[] }> = {
//     mysql: (dataToFix) => FixMySQLRequestFormat(dataToFix),
// };

// const CreateFieldAndParams = (
//     db_type: string,
//     obj: any,
//     beforeObjLength: number,
//     feature: string,
//     reqKey: string
// ) => {
//     try {
//         const dataToFix = { obj, beforeObjLength, feature, reqKey };
//         const fixedData = dbTypeCreateFieldAndParams[db_type](dataToFix);

//         if (!fixedData) {
//             throw new Error(`Unsupported db_type: ${db_type}`);
//         }

//         return {
//             fields: fixedData.fields,
//             params: fixedData.params,
//         };
//     } catch (error) {
//         console.error('CreateFieldAndParams (Error):', error);
//         throw error;
//     }
// };



// /**
//  * @function FixRequestFormat - ສຳຫຼັບການປ່ຽນແປງຮູບແບບຂໍ້ມູນເພື່ອໄປ Query ໃຫ້ຖືກຕາມທີ່ Request
//  * @param request - Object
//  * @returns Object
//  * @throws {error}
//  */



// export const FixRequestFormat = async (request: any) => {
//     try {
//         console.log('> FixRequestFormat : ');
//         console.log('- Request to fix : ', request);

//         if (!request) {
//             return { params: [], fields: null };
//         }

//         const dataToReturn: any = {};
//         request['params'] = [];
//         const { set, where, db_type, field_list, feature } = request;

//         if (set && (isObject(set) || isArray(set))) {
//             const whereDataLength = !where ? 0 : Object.keys(where).length;
//             const fixedSet = CreateFieldAndParams(db_type, set, whereDataLength, feature, "set");
//             console.log('* Fixed Set : ', fixedSet);

//             request['set'] = fixedSet.fields;
//             request['params'] = [...request.params, ...fixedSet.params];
//             dataToReturn['set'] = request['set'];
//         }

//         if (where && (isObject(where) || isString(where))) {
//             const setDataLength = !set ? 0 : Object.keys(set).length;
//             const fixedWhere = CreateFieldAndParams(db_type, where, setDataLength, feature, "where");
//             // console.log('* Fixed Where : ', fixedWhere);

//             request['where'] = fixedWhere.fields;
//             request['params'] = [...request.params, ...fixedWhere.params];
//             dataToReturn['where'] = request['where'];
//             console.log('* FixedRequestFormat (dataToReturn) : ', dataToReturn);
//         }

//         if (where && isString(where) && feature === 'fetch') {
//             const splittedWhere = where.split(':');
//             console.log('* Splitted Where : ', splittedWhere);

//             const primaryKeyField = splittedWhere[0];
//             const paramValue = splittedWhere[1];

//             if (paramValue !== "LAST") {
//                 throw { kind: 'incomplete_request' };
//             }

//             // For fetch the last row
//             dataToReturn['where'] = `ORDER BY ${primaryKeyField} DESC`;
//         }

//         if (field_list) {
//             if (isArray(field_list)) {
//                 const fixedFormatFieldList = field_list.join(', ');
//                 console.log('* Fixed Field List : ', fixedFormatFieldList);

//                 request['field_list'] = fixedFormatFieldList;
//                 dataToReturn['field_list'] = request['field_list'];
//             }

//             if (isString(field_list)) {
//                 dataToReturn['field_list'] = field_list;
//             }
//         }

//         console.log('* FixedRequestFormat (return) : ', request);
//         return {
//             params: request['params'],
//             ...dataToReturn
//         };
//     } catch (error: any) {
//         console.log('FixRequestFormat (Error): ', error.message);
//         throw error;
//     }
// }



// const dbTypeCreateFieldAndParams: any = {
//     mysql: (dataToFix: any) => FixMySQLRequestFormat(dataToFix),
// }

// // obj is set or where
// const CreateFieldAndParams = (db_type: string, obj: any, beforeObjLength: number, feature: string, reqKey: string) => {
//     try {
//         console.log('- CreateFieldAndParams : ', obj, feature, reqKey);

//         const dataToFix = {
//             obj, beforeObjLength, feature, reqKey
//         }

//         const fixedData = dbTypeCreateFieldAndParams[db_type](dataToFix);
//         console.log('Fixed Fields : ', fixedData);

//         return {
//             fields: fixedData.fields,
//             params: fixedData.params
//         };
//     } catch (error) {
//         console.log('CreateFieldAndParams : ', error);
//         throw error;
//     }
// };