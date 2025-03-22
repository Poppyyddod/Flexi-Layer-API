import { sqlNumberType, sqlStringType } from '../sql.datatype';
import { mappingMethodTableDataStructure } from '../mapping/table-data-structure/sql.method';
import { dataStructureQueryCmd } from '../mapping/table-data-structure/sql.secretdata';
import { isArray, isObject, isString } from '@Helper/Utils';






/**
 * @function ValidateTableMapper
 * For check store. is it mapped with the table? or The table does exist?.
 * @param dbPositionData - Key # db_type, db_store, feature
 * @returns Key # table data structure
 */

export const ValidateTableMapper = async (dbPositionData: any) => {
    try {
        const cmd = await dataStructureQueryCmd[dbPositionData.db_type];
        // console.log('ValidateTableMapper (cmd) :', cmd);

        const tableDataStructure = await mappingMethodTableDataStructure[dbPositionData.db_type](dbPositionData, cmd);
        // console.log('ValidateTableMapper (tableDataStructure) : ', dbPositionData.db_type, tableDataStructure);

        // Ensure that 'fields' is an array of objects
        if (!Array.isArray(tableDataStructure) || tableDataStructure.length === 0) {
            console.log('* Table is not found in the database : ', dbPositionData.store);
            throw { kind: 'not_found_the_store' };
        }

        return tableDataStructure;
    } catch (error) {
        console.log('ValidateTableMapper (Error):', error);
        throw error;
    }
}




/**
 * @function ValidateFieldsBeforeInsert
 * For check `request field`. is it valid as the `table structure` before `insert` query to database
 * @param tableFields - Key # Table structure (field, data type, comment)
 * @param data - Key # Request data
 * No return
 */

/**

 * @function CheckFieldComment
 * For check the `set` field, Has field comment from the table as `comment` parameter
 */

export const ValidateFieldsBeforeInsert = async (tableFields: any, data: any) => {
    try {
        console.log('* ValidateFieldsBeforeInsert (data) : ', data);
        const requestFields = data;
        console.log('CheckRequiredFieldsToInsert (requestField):', requestFields);

        const primaryKeyFieldInReq = await CheckFieldComment(requestFields, tableFields, 'primary key');
        // console.log('CheckRequiredFieldsToInsert (primaryKeyFieldInReq):', primaryKeyField);

        if (primaryKeyFieldInReq.length > 0) {
            throw { kind: 'cannot_insert_data_with_primary_key' };
        }

        const emptyCommentFieldInReq = tableFields.filter((field: any) => field.comment === '');
        // console.log('CheckRequiredFieldsToInsert (emptyCommentFieldInReq):', emptyCommentField);

        if (emptyCommentFieldInReq.length > 0) {
            // console.log('\x1b[33m[ERROR] : Missing comment field!! : \x1b[0m', emptyCommentFieldInReq);
            throw { kind: 'missing_comment_field' };
        }

        CheckMatterFieldsComment(tableFields, requestFields, "required");

        CheckMatterFieldsComment(tableFields, requestFields, "foreign key");
    } catch (error) {
        console.log('CheckRequiredFieldsToInsert (Error):', error);
        throw error;
    }
};


const CheckMatterFieldsComment = (tableFields: any, requestFields: any, comment: string) => {
    const theCommentFieldInTheTable = tableFields.filter((field: any) => field.comment === comment);
    // console.log('CheckThisFieldsComment (theCommentFieldInTheTable):', theCommentFieldInTheTable);

    if (isArray(requestFields)) {
        requestFields.forEach((reqIndex: any) => {
            const theCommentFieldInReq = CheckFieldComment(reqIndex, tableFields, comment);
            // console.log('CheckThisFieldsComment (theCommentFieldInReq):', theCommentFieldInReq);

            if (theCommentFieldInTheTable.length !== theCommentFieldInReq.length) {
                throw { kind: 'missing_required_field' };
            }
        })
    } else {
        const theCommentFieldInReq = CheckFieldComment(requestFields, tableFields, comment);
        // console.log('CheckThisFieldsComment (theCommentFieldInReq):', theCommentFieldInReq);

        if (theCommentFieldInTheTable.length !== theCommentFieldInReq.length) {
            throw { kind: 'missing_required_field' };
        }
    }
}



/**
 * @function CheckFieldComment
 * For check the `set` field, Has field comment from the table as `comment` parameter
 * @param requestFields - Array # `set` request data
 * @param tableFields - Array # `Table` structure data (field, data type, comment)
 * @param comment - string # Comment for checking
 * @returns 
 */

export const CheckFieldComment = (requestFields: any, tableFields: any, comment: string) => {
    console.log(`* CheckFieldComment (comment) : ${comment}`, requestFields);
    const theCommentFieldsArr = tableFields
        .filter((field: any) => field.comment === comment)
        .map((field: any) => field.field);
    console.log('CheckFieldComment (theCommentFieldsArr):', theCommentFieldsArr);

    const filteredFields = theCommentFieldsArr.filter((field: string) => field in requestFields);
    console.log('CheckFieldComment (Object)(filteredFields):', filteredFields);

    return filteredFields;
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

const CheckForFetchLastRow = async (whereData: any) => {
    if (!isString(whereData)) return;

    console.log('ValidateFieldsAndType (where is string type):', whereData);

    const splittedWhere = whereData.split(':');
    console.log('ValidateFieldsAndType (splittedWhere):', splittedWhere);

    if (splittedWhere.length !== 2 || splittedWhere[1] !== 'LAST') {
        throw { kind: 'incomplete_request' };
    }

    const primaryKeyField = splittedWhere[0];
    const value = splittedWhere[1];

    const newWhereData = {
        [primaryKeyField]: 0
    }
    console.log('ValidateFieldsAndType (newWhereData):', newWhereData);

    return newWhereData;
}


export const ValidateFieldsAndType = async (tableDataStructure: any[], data: any) => {
    try {
        let isValid = true;
        console.log('> ValidateFieldsAndType (tableDataStructure): ', tableDataStructure);
        console.log('> ValidateFieldsAndType (data)(1): ', data);

        if (data.where && isString(data.where)) {
            const dataFromCheckForFetchLastRow = await CheckForFetchLastRow(data.where);
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


// obj is set or where
const StartCheckFieldAndType = (isValid: boolean, tableDataStructure: any, obj: any, reqKey: string) => {
    console.log('* StartCheckFieldAndType (obj):', isValid, obj);

    // if (obj === undefined) return true;

    for (const [dataKey, dataValue] of Object.entries(obj)) {
        console.log('* StartCheckFieldAndType (loop data):', dataKey, dataValue);

        const matchingField = tableDataStructure.find((tableData: any) => tableData.field === dataKey);
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


const CheckerManFieldAndKey = (dataValue: any, reqKey: string) => {
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