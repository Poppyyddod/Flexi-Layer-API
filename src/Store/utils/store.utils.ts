import dotenv from 'dotenv';
dotenv.config();

import {
    convertStringToJson,
    isArray
} from '@Helper/Utils';
import { ObjectId } from 'mongodb';


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
        const theStore = mapping[trimmedCode];
        // console.log('Trimmed Code:', trimmedCode);
        // console.log('StoreMapping : ', theStore);
        // console.log('CheckStoreLength : ', theStore.length);

        if (!(trimmedCode in mapping)) {
            throw { kind: 'invalid_store_code' };
        }

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

        request['params'] = [];
        const { set, where, db_type } = request;

        if (set) {
            const fixedSet = createFieldsAndParams(db_type, set, 0, 'set');
            // console.log('Fixed Set : ', fixedSet);

            request['set'] = fixedSet.fields;
            request['params'] = [...request.params, ...fixedSet.params];
        }

        if (where) {
            const setDataLength = !set ? 0 : Object.keys(set).length;
            const fixedWhere = createFieldsAndParams(db_type, where, setDataLength, 'where');
            // console.log('Fixed Where : ', fixedWhere);

            request['where'] = fixedWhere.fields;
            request['params'] = [...request.params, ...fixedWhere.params];
        }

        console.log('* FixedRequestFormat (return) : ', request);
        return request;
    } catch (error: any) {
        console.log('fixResponsitory (Error): ', error.message);
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
    postgresql: (obj: any, setDataLength: number, feature: string) => {
        const fields = Object.keys(obj)
            .map((key, index) => `${key} = $${index + setDataLength + 1}`)
            .join(feature === 'set' ? ', ' : ' AND ');
        console.log('createFieldsAndParams (PostgreSQL) : ', fields);

        return fields;
    },

    mysql: (obj: any, setDataLength: number, feature: string) => {
        const fields = Object.keys(obj).map(key => `${key} = ?`).join(feature === 'set' ? ', ' : ' AND ');
        console.log('createFieldsAndParams (MySQL) : ', fields);

        return fields;
    }
}

const createFieldsAndParams = (db_type: string, obj: any, setDataLength: number, feature: any) => {
    try {
        console.log('- createFieldsAndParams : ', obj, feature);

        const params = Object.values(obj);
        const fields = dbTypeCreateFieldsAndParams[db_type](obj, setDataLength, feature);
        console.log('Fixed Fields : ', fields, params);

        return { fields, params };
    } catch (error) {
        console.log('createFieldsAndParams : ', error);
        throw error;
    }
};