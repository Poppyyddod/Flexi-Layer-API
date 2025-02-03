/**
 * Store Respository Model
 */

export interface ServiceMappedFeature {
    [feature: string]: RespositoryMethodsModel; // แต่ละ feature จะมี methods ครบ
}

// ສຳຫຼັບ Respository Key
export type RespositoryKeys = 'fetch' | 'create' | 'edit' | 'remove';

// ສຳຫຼັບ Respository Methods
export type RespositoryMethodsModel = {
    [key in RespositoryKeys]: (helpers: any) => (dataFromResposCenter: ValidAllDataFromService) => Promise<void>
}

export type ValidAllDataFromService = {
    db_type: string;
    store: string;
    fixedFormat: any;
}