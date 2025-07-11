import { isObject } from "@SRC/Helper/Utils";
import { FixMySQLRequestFormat } from "./FixRequestFormat/Databases";
import { GetCachedTableStructure } from "@SRC/Helper/Cache";
import { IMySQLTableStructure } from "@SRC/Helper/Model/global.model";

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

        console.log('FixRequestFormat (request):', request);
        const { set, where, db_type, store_code, field_list, feature } = request;
        const params: any[] = [];
        const result: Partial<RequestFormat> = {};

        // 1. Handle SET
        const setResult = handleSet(set, where, db_type, feature);
        if (setResult) {
            result.set = setResult.fields;
            params.push(...setResult.params);
        }

        // 2. Handle WHERE (Object only)
        const whereResult = handleWhere(where, set, db_type, feature);
        if (whereResult) {
            result.where = whereResult.fields;
            params.push(...whereResult.params);
        }

        // 3. Handle Special Case fetch:LAST
        if (typeof where === 'string' && feature === 'fetch') {
            const specialWhere = handleFetchLast(store_code, where);
            if (specialWhere) result.where = specialWhere;
        }

        // 4. Handle field_list
        result.field_list = handleFieldList(field_list);

        return { ...result, params };
    } catch (error: any) {
        console.error('FixRequestFormat (Error):', error?.message ?? error);
        throw error;
    }
};

// ---------------------- Helper Functions ----------------------

const handleSet = (
    set: RequestFormat['set'],
    where: RequestFormat['where'],
    db_type: string,
    feature?: string
) => {
    if (!set || (!isObject(set) && !Array.isArray(set))) return null;
    const whereLength = isObject(where) ? Object.keys(where!).length : 0;
    return CreateFieldAndParams(db_type, set, whereLength, feature!, 'set');
};

const handleWhere = (
    where: RequestFormat['where'],
    set: RequestFormat['set'],
    db_type: string,
    feature?: string
) => {
    if (!isObject(where)) return null;
    const setLength = isObject(set) ? Object.keys(set!).length : 0;
    return CreateFieldAndParams(db_type, where, setLength, feature!, 'where');
};

const handleFetchLast = (storeCode: string, where: string) => {
    const [primaryKey, value] = where.split(':');
    const tablePrimaryKey = GetCachedTableStructure()[storeCode].find((item: IMySQLTableStructure) => item.comment === "primary key");
    console.log('handleFetchLast (tablePrimaryKey):', tablePrimaryKey);

    if (tablePrimaryKey?.field !== primaryKey) throw { kind: 'invalid_field_name' };
    if (value !== 'LAST') throw { kind: 'incomplete_request' };
    return `ORDER BY ${primaryKey} DESC`;
};

const handleFieldList = (field_list?: string | string[]) => {
    if (!field_list) return undefined;
    return Array.isArray(field_list) ? field_list.join(', ') : field_list;
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