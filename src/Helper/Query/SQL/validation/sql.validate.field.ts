import { isArray, isObject, isString } from "@SRC/Helper/Utils";
import { sqlNumberType, sqlStringType } from '../sql.datatype';
import { IMySQLTableStructure } from "@SRC/Helper/Model/global.model";





const CheckForFetchLastRow = (whereData: any): any => {
    if (!isString(whereData)) return;

    console.log('ValidateFieldsAndType (where is string type):', whereData);

    const splittedWhere: string[] = whereData.split(':');
    console.log('ValidateFieldsAndType (splittedWhere):', splittedWhere);

    if (splittedWhere.length !== 2 || splittedWhere[1] !== 'LAST') {
        throw { kind: 'incomplete_request' };
    }

    const primaryKeyField: string = splittedWhere[0];
    const value: string = splittedWhere[1];

    const newWhereData = {
        [primaryKeyField]: 0
    }
    console.log('ValidateFieldsAndType (newWhereData):', newWhereData);

    return newWhereData;
}







const CheckerManFieldAndKey = (dataValue: any, reqKey: string): void => {
    console.log('> CheckerFieldAndKey (dataValue):', dataValue, reqKey);

    // Set field value is array
    if (Array.isArray(dataValue) && reqKey === "set") {
        console.log("[Error][CheckerFieldAndKey] Set field value is array");
        throw { kind: 'invalid_data_type' };
    }

    // Where has object type in the field array value
    if (Array.isArray(dataValue) && reqKey === "where") {
        console.log("[Error][CheckerFieldAndKey] Where has object type in the field array value");
        dataValue.forEach((item: any) => {
            if (isObject(item)) throw { kind: 'invalid_data_type' };
        })
    }
}






// obj is set or where
const StartCheckFieldAndType = (isValid: boolean, tableDataStructure: IMySQLTableStructure[], obj: any, reqKey: string): boolean => {
    console.log('* StartCheckFieldAndType (obj):', isValid, obj);

    // if (obj === undefined) return true;

    for (const [dataKey, dataValue] of Object.entries(obj)) {
        console.log('* StartCheckFieldAndType (loop data):', dataKey, dataValue);

        const matchingField = tableDataStructure
        .find((tableData: any) => tableData.field === dataKey) as IMySQLTableStructure | undefined;

        console.log('* StartCheckFieldAndType (matchingField):', matchingField);

        if (!matchingField) {
            console.error(`* Field '${dataKey}' not found in store.`);
            throw { kind: 'invalid_field_name' };
        }

        // Fields type
        const dataType = matchingField.type.split('(')[0];
        console.log('* StartCheckFieldAndType (dataType):', dataType);

        CheckerManFieldAndKey(dataValue, reqKey);

        if (Array.isArray(dataValue)) {
            if (reqKey === "set") return false;

            console.log('For array data type: ', dataKey, dataValue);

            const hasObject = dataValue.some(item => typeof item === "object" && isObject(item));
            console.log('StartCheckFieldAndType (hasObject):', hasObject);

            isValid = hasObject ? false : true;
            // isValid = true;
            continue;
        }

        // Check the expected type
        if (sqlNumberType.includes(dataType) && typeof dataValue !== 'number') {
            console.log('Invalid number for field:', dataKey);
            throw { kind: 'invalid_data_type' };
        }

        if (sqlStringType.includes(dataType) && typeof dataValue !== 'string') {
            console.log('Invalid string for field:', dataKey);
            throw { kind: 'invalid_data_type' };
        }

        console.log("End StartCheckFieldAndType : ", isValid, dataKey, dataValue);
        isValid = true;
    }

    return isValid;
}





/**
 * @function ValidateFieldsAndType - For check request `Fields` & `DataType` are valid as table structure
 * @param fields - Database table structure (field, data type, comment)
 * @param data - Request body object
 * @returns Boolean
 * @throws {Error}
 */

/**
 * 
 * @sqlNumberType
 * It's array to keep `number` data type for check request data type
 */

/**
 * 
 * @sqlStringType
 * It's array to keep `string` data type for check request data type
 */

export const ValidateFieldsAndType = (tableDataStructure: IMySQLTableStructure[], data: any) => {
    try {
        let isValid = true;
        console.log('> ValidateFieldsAndType (tableDataStructure): ', tableDataStructure);
        console.log('> ValidateFieldsAndType (data)(1): ', data);

        if (data.where && isString(data.where)) {
            const dataFromCheckForFetchLastRow = CheckForFetchLastRow(data.where);
            console.log('* ValidateFieldsAndType (dataFromCheckForFetchLastRow):', dataFromCheckForFetchLastRow);

            if (dataFromCheckForFetchLastRow) {
                data = { ...data, ...dataFromCheckForFetchLastRow };
            }
        } else {
            console.log('# ValidateFieldsAndType (data.where is not string):', data.where);

            // const testFixData = { ...data, ...data.where };
            // console.log('# ValidateFieldsAndType (testFixData):', testFixData);

            data = { ...data, ...data.where };

            console.log('* ValidateFieldsAndType (current data):', data);
        }

        // delete data['where'];
        console.log('> ValidateFieldsAndType (data)(2): ', data);

        if (isArray(data.set)) {
            data.set.forEach((obj: any) => {
                isValid = StartCheckFieldAndType(isValid, tableDataStructure, obj, "set");
            });
        } else if (isObject(data?.set) || isObject(data?.where)) {
            console.log('> ValidateFieldsAndType (Object): isObject(data.set) || isObject(data.where)');
            if (data.set) {
                isValid = StartCheckFieldAndType(isValid, tableDataStructure, data.set, "set");
            }

            if (data.where) {
                isValid = StartCheckFieldAndType(isValid, tableDataStructure, data.where, "where");
            }
        } else {
            console.log('* ValidateFieldsAndType (data.set is not object or array):', data.set);
            // throw { kind: 'invalid_data_type' };
        }

        return isValid;
    } catch (error) {
        console.error('CheckDataKeyAndType (Error):', error);
        throw error;
    }
};