/**
 * @SQLmanagementModel
 * SQL management parameter model
 */

export interface SQLmanagementModel {
    cmd: string;
    params: any;
    isReturn: boolean;
}