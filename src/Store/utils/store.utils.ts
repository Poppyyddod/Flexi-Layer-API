import dotenv from 'dotenv';
dotenv.config();

import {
    convertStringToJson,
    isArray,
    isObject,
    isString
} from '@Helper/Utils';
import { ObjectId } from 'mongodb';
import { FixMySQLRequestFormat, FixPostgreSQLRequestFormat } from './FixRequestFormat/Databases';


/**
 * @function StoreMapping - ສຳຫຼັບການກວດສອບຂອງ Store/Table name
 * @param code - ລະຫັດຂອງ Store
 * @returns {String} - Store/Table name
 */


const dbTypeMapping: any = {
    postgresql: async () => {
        try {
            const codeToMapping = process.env.POSTGRESQL_STORE_MAPPING || '';
            return codeToMapping;
        } catch (error) {
            console.log('StoreMapping (dbTypeMapping)(PostgreSQL)(Error):', error);
            throw error;
        }
    },

    mysql: async () => {
        try {
            const codeToMapping = process.env.MYSQL_STORE_MAPPING || '';
            return codeToMapping;
        } catch (error) {
            console.log('StoreMapping (dbTypeMapping)(MySQL)(Error):', error);
            throw error;
        }
    },

    mongodb: async () => {
        try {
            const codeToMapping = process.env.MONGODB_STORE_MAPPING || '';
            return codeToMapping;
        } catch (error) {
            console.log('StoreMapping (dbTypeMapping)(MongoDB)(Error):', error);
            throw error;
        }
    }
}

export const StoreMapping = async (db_type: string, code: string) => {
    try {
        const codeToMapping = await dbTypeMapping[db_type]();
        const mapping = await convertStringToJson(codeToMapping);

        console.log('Stores in the ENV:', mapping);
        // console.log('Code:', code);
        // console.log('StoreMapping : ', mapping[code]);

        const trimmedCode = code.trim();
        // console.log('Trimmed Code:', trimmedCode);

        if (!(trimmedCode in mapping)) {
            throw { kind: 'invalid_store_code' };
        }

        const theStore = mapping[trimmedCode];
        // console.log('StoreMapping : ', theStore);
        // console.log('CheckStoreLength : ', theStore.length);

        return theStore;
    } catch (error) {
        console.log('StoreMapping (Error):', error);
        throw error;
    }
};


/**
 * @function FixRequestFormat - ສຳຫຼັບການປ່ຽນແປງຮູບແບບຂໍ້ມູນເພື່ອໄປ Query ໃຫ້ຖືກຕາມທີ່ Request
 * @param request - Object
 * @returns Object
 * @throws {error}
 */



export const FixRequestFormat = async (request: any) => {
    try {
        console.log('> FixRequestFormat : ');
        console.log('- Request to fix : ', request);

        if (!request) {
            return { params: [], fields: null };
        }

        const dataToReturn: any = {};
        request['params'] = [];
        const { set, where, db_type, field_list, feature } = request;

        if (set && (isObject(set) || isArray(set))) {
            const whereDataLength = !where ? 0 : Object.keys(where).length;
            const fixedSet = createFieldsAndParams(db_type, set, whereDataLength, feature, "set");
            console.log('* Fixed Set : ', fixedSet);

            request['set'] = fixedSet.fields;
            request['params'] = [...request.params, ...fixedSet.params];
            dataToReturn['set'] = request['set'];
        }

        if (where && (isObject(where) || isString(where))) {
            const setDataLength = !set ? 0 : Object.keys(set).length;
            const fixedWhere = createFieldsAndParams(db_type, where, setDataLength, feature, "where");
            // console.log('* Fixed Where : ', fixedWhere);

            request['where'] = fixedWhere.fields;
            request['params'] = [...request.params, ...fixedWhere.params];
            dataToReturn['where'] = request['where'];
            console.log('* FixedRequestFormat (dataToReturn) : ', dataToReturn);
        }

        if (where && isString(where) && feature === 'fetch') {
            const splittedWhere = where.split(':');
            console.log('* Splitted Where : ', splittedWhere);

            const primaryKeyField = splittedWhere[0];
            const paramValue = splittedWhere[1];

            if (paramValue !== "LAST") {
                throw { kind: 'incomplete_request' };
            }

            // For fetch the last row
            dataToReturn['where'] = `ORDER BY ${primaryKeyField} DESC`;
        }

        if (field_list) {
            if (isArray(field_list)) {
                const fixedFormatFieldList = field_list.join(', ');
                console.log('* Fixed Field List : ', fixedFormatFieldList);

                request['field_list'] = fixedFormatFieldList;
                dataToReturn['field_list'] = request['field_list'];
            }

            if (isString(field_list)) {
                dataToReturn['field_list'] = field_list;
            }
        }

        console.log('* FixedRequestFormat (return) : ', request);
        return {
            params: request['params'],
            ...dataToReturn
        };
    } catch (error: any) {
        console.log('FixRequestFormat (Error): ', error.message);
        throw error;
    }
}






export const FixWhereRequestFormat = async (validRequestData: any) => {
    try {
        console.log('FixNoSqlRequestFormat : ', validRequestData);

        const { db_type, store, feature, set, where } = validRequestData;

        if (!where || (where && !("_id" in where)))
            return validRequestData;

        if (Object.keys(where).length > 1)
            throw { kind: "cannot_mix_where_data_with_nosql" };

        if (!isArray(where['_id']))
            throw { kind: "object_id_must_be_array" };

        const objectIds = where['_id'].map((id: any) => new ObjectId(id));
        const whereData = { _id: { $in: objectIds } }

        validRequestData['where'] = whereData;

        return validRequestData;
    } catch (error) {
        console.log('FixNoSqlRequestFormat (Error):', error);
        throw error;
    }
}






const dbTypeCreateFieldsAndParams: any = {
    // postgresql: (obj: any, setDataLength: number, feature: string, reqKey: string) => {
    //     // const fields = Object.keys(obj)
    //     //     .map((key, index) => `${key} = $${index + setDataLength + 1}`)
    //     //     .join(feature === 'set' ? ', ' : ' AND ');
    //     // console.log('createFieldsAndParams (PostgreSQL) : ', fields);

    //     // return fields;

    //     const type = feature === 'set' ? ', ' : ' AND ';
    //     const fields: string[] = [];
    //     const values: any[] = [];
    //     let paramIndex = 1;

    //     Object.entries(obj).forEach(([key, value]) => {
    //         if (Array.isArray(value)) {
    //             console.log("* Array Field Value : ", key, value);
    //             const placeholders = value.map(() => `$${paramIndex++}`).join(', ');
    //             fields.push(`${key} IN (${placeholders})`);
    //             values.push(...value);
    //         } else {
    //             fields.push(`${key} = $${paramIndex++}`);
    //             values.push(value);
    //         }
    //     });

    //     const queryString = fields.join(type);
    //     console.log('createFieldsAndParams (PostgreSQL) :', queryString);
    //     console.log('Params:', values);

    //     return {
    //         fields: queryString,
    //         params: values
    //     };
    // },

    postgresql: (dataToFix: any) => FixPostgreSQLRequestFormat(dataToFix),
    mysql: (dataToFix: any) => FixMySQLRequestFormat(dataToFix),
}

// obj is set or where
const createFieldsAndParams = (db_type: string, obj: any, beforeObjLength: number, feature: string, reqKey: string) => {
    try {
        console.log('- createFieldsAndParams : ', obj, feature, reqKey);

        const dataToFix = {
            obj, beforeObjLength, feature, reqKey
        }

        const fixedData = dbTypeCreateFieldsAndParams[db_type](dataToFix);
        console.log('Fixed Fields : ', fixedData);

        return {
            fields: fixedData.fields,
            params: fixedData.params
        };
    } catch (error) {
        console.log('createFieldsAndParams : ', error);
        throw error;
    }
};