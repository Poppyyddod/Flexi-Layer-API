/**
 * @function ValidateFieldsBeforeInsert
 * For check `request field`. is it valid as the `table structure` before `insert` query to database
 * @param tableFields - Key # Table structure (field, data type, comment)
 * @param data - Key # Request data
 * No return
 */

import { isArray } from "@SRC/Helper/Utils";

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

        CheckRequiredField(tableFields, requestFields, "required");
        CheckRequiredField(tableFields, requestFields, "foreign key");
    } catch (error) {
        console.log('CheckRequiredFieldsToInsert (Error):', error);
        throw error;
    }
};


export const CheckRequiredField = (tableFields: any, requestFields: any, comment: string) => {
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