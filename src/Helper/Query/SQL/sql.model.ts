/**
 * @SQLmanagementModel
 * SQL management parameter model
 */

export interface SQLmanagementModel {
    cmd: string;
    params: any;
    isReturn: boolean;
}


// export type SqlTableDescData = [
//     {
//         fields: string,
//         type: string,
//         comment: string
//     }
// ]