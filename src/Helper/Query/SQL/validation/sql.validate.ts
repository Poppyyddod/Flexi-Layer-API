import { sqlNumberType, sqlStringType } from '../sql.datatype';
import { mappingMethodTableDataStructure } from '../mapping/table-data-structure/sql.method';
import { dataStructureQueryCmd } from '../mapping/table-data-structure/sql.secretdata';






/**
 * @function ValidateTableMapper
 * For check store. is it mapped with the table? or The table does exist?.
 * @param dbPositionData - Key # db_type, db_store, feature
 * @returns Key # table data structure
 */

export const ValidateTableMapper = async (dbPositionData: any) => {
    try {
        const cmd = await dataStructureQueryCmd[dbPositionData.db_type];
        // console.log('StartCheckRequestDataStructure (cmd) :', cmd);

        const tableDataStructure = await mappingMethodTableDataStructure[dbPositionData.db_type](dbPositionData, cmd);
        console.log('Table data structure (ValidateTableMapper): ', dbPositionData.db_type, tableDataStructure);

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
        const requestField = [...Object.keys(data)];
        // console.log('CheckRequiredFieldsToInsert (requestField):', requestField);

        const primaryKeyField = await CheckFieldComment(requestField, tableFields, 'primary key');
        // console.log('CheckRequiredFieldsToInsert (primaryKeyField):', primaryKeyField);

        if (primaryKeyField.length === 0) {
            throw { kind: 'cannot_insert_data_with_primary_key' };
        }

        const emptyCommentField = tableFields.filter((field: any) => field.comment === '');
        // console.log('CheckRequiredFieldsToInsert (emptyCommentField):', emptyCommentField);

        if (emptyCommentField.length > 0) {
            console.log('\x1b[33m[ERROR] : Missing comment field!! : \x1b[0m', emptyCommentField);
            throw { kind: 'missing_comment_field' };
        }

        const missingRequiredFields = await CheckFieldComment(requestField, tableFields, 'required');
        // console.log('CheckRequiredFieldsToInsert (missingRequiredFields):', missingRequiredFields);

        if (missingRequiredFields.length > 0) {
            throw { kind: 'missing_required_field' };
        }
    } catch (error) {
        console.log('CheckRequiredFieldsToInsert (Error):', error);
        throw error;
    }
};






/**
 * @function CheckFieldComment
 * For check the `set` field, Has field comment from the table as `comment` parameter
 * @param requestFields - Array # `set` request data
 * @param tableFields - Array # `Table` structure data (field, data type, comment)
 * @param comment - string # Comment for checking
 * @returns 
 */

const CheckFieldComment = (requestFields: any, tableFields: any, comment: string) => {
    const theCommentFieldsArr = tableFields
        .filter((field: any) => field.comment === comment)
        .map((field: any) => field.field);
    // console.log('CheckFieldComment (theCommentFieldsArr):', theCommentFieldsArr);

    const filteredFields = theCommentFieldsArr.filter((field: any) => !requestFields.includes(field));
    // console.log('CheckFieldComment (filteredFields):', filteredFields);

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

export const ValidateFieldsAndType = async (fields: any[], data: object) => {
    try {
        for (const [dataKey, dataValue] of Object.entries(data)) {
            const matchingField = fields.find(fieldObj => fieldObj.field === dataKey);

            if (!matchingField) {
                console.error(`* Field '${dataKey}' not found in store.`);
                throw { kind: 'invalid_field_name' };
            }

            // Fields type
            const fieldType = matchingField.type.split('(')[0];

            // Check the expected type
            if (sqlNumberType.includes(fieldType) && typeof dataValue !== 'number') {
                console.log('Invalid number for field:', dataKey);
                throw { kind: 'invalid_data_type' };
            }

            if (sqlStringType.includes(fieldType) && typeof dataValue !== 'string') {
                console.log('Invalid string for field:', dataKey);
                throw { kind: 'invalid_data_type' };
            }
        }

        return true;
    } catch (error) {
        console.error('CheckDataKeyAndType (Error):', error);
        throw error;
    }
};