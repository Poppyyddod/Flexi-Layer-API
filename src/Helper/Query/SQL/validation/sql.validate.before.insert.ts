/**
 * @function ValidateFieldsBeforeInsert
 * For check `request field`. is it valid as the `table structure` before `insert` query to database
 * @param tableDataStructure - Key # Table structure (field, data type, comment)
 * @param data - Key # Request data
 * No return
 */

import { IMySQLTableStructure } from "@SRC/Helper/Model/global.model";
import { isArray } from "@SRC/Helper/Utils";

/**

 * @function CheckFieldComment
 * For check the `set` field, Has field comment from the table as `comment` parameter
 */

export const ValidateFieldsBeforeInsert = (tableDataStructure: IMySQLTableStructure[], setObj: any): void => {
    try {
        console.log('* ValidateFieldsBeforeInsert (data) : ', setObj);

        const requestFields = setObj;
        console.log('CheckRequiredFieldsToInsert (requestField):', requestFields);

        const primaryKeyFieldInReq = CheckFieldComment(requestFields, tableDataStructure, 'primary key');
        // console.log('CheckRequiredFieldsToInsert (primaryKeyFieldInReq):', primaryKeyField);

        if (primaryKeyFieldInReq.length > 0)
            throw { kind: 'cannot_insert_data_with_primary_key' };

        const emptyCommentFieldInReq = tableDataStructure.filter((field: any) => field.comment === '');
        // console.log('CheckRequiredFieldsToInsert (emptyCommentFieldInReq):', emptyCommentField);

        if (emptyCommentFieldInReq.length > 0) {
            // console.log('\x1b[33m[ERROR] : Missing comment field!! : \x1b[0m', emptyCommentFieldInReq);
            throw { kind: 'missing_comment_field' };
        }

        CheckRequiredField(tableDataStructure, requestFields, "required");
        CheckRequiredField(tableDataStructure, requestFields, "foreign key");
    } catch (error) {
        console.log('CheckRequiredFieldsToInsert (Error):', error);
        throw error;
    }
};


export const CheckRequiredField = (tableDataStructure: any, requestFields: any, comment: string): void => {
    const theCommentFieldInTheTable = tableDataStructure.filter((field: any) => field.comment === comment);
    // console.log('CheckThisFieldsComment (theCommentFieldInTheTable):', theCommentFieldInTheTable);

    if (isArray(requestFields)) {
        requestFields.forEach((reqIndex: any) => {
            const theCommentFieldInReq = CheckFieldComment(reqIndex, tableDataStructure, comment);
            // console.log('CheckThisFieldsComment (theCommentFieldInReq):', theCommentFieldInReq);

            if (theCommentFieldInTheTable.length !== theCommentFieldInReq.length) {
                throw { kind: 'missing_required_field' };
            }
        })
    } else {
        const theCommentFieldInReq = CheckFieldComment(requestFields, tableDataStructure, comment);
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
 * @param tableDataStructure - Array # `Table` structure data (field, data type, comment)
 * @param comment - string # Comment for checking
 * @returns 
 */

export const CheckFieldComment = (requestFields: any, tableDataStructure: IMySQLTableStructure[], comment: string): boolean[] => {
    console.log(`* CheckFieldComment (comment) : ${comment}`, requestFields);

    const theCommentFieldsArr = tableDataStructure
        .filter((field: any) => field.comment === comment)
        .map((field: any) => field.field);
    console.log('CheckFieldComment (theCommentFieldsArr):', theCommentFieldsArr);

    const filteredFields: boolean[] = theCommentFieldsArr.filter((field: string) => field in requestFields);
    console.log('CheckFieldComment (Object)(filteredFields):', filteredFields);

    return filteredFields;
}