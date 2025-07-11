/**
 * @listCmdType
 * For `cmdType` mapping to check the command which data type to return.
 */

/**
 * For each type is difference such as
 * affect - Row update type
 * data - Row fetch data
 * affect_data - Row fetch data & Reference the row data
 */

export const listCmdType = {
    affect: ['UPDATE', 'DELETE'],
    data: ['SELECT', 'INSERT'],
    affect_data: ['SELECT']
}