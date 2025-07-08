/**
 * Store Service Model
 */

// Model ການ Mapping Feature ແລະ Method
export interface ServiceMappedFeature {
    [feature: string]: ServiceMethodsModel; // แต่ละ feature จะมี methods ครบ
}

// Model List ສຳຫຼັບ Service features
export type ServiceKeys = 'fetch' | 'create' | 'edit' | 'remove';

// Model ໃຫ້ການບໍລິການສົ່ງຂໍ້ມູນກັບມາເປັນແບບເທົ່ານັ້ນ DataToServiceCenterModel
export type ServiceMethodsModel = {
    [key in ServiceKeys]: (helpers: any) => (reqBodyData: ValidRequestDataModel) => Promise<ValidDataAndFixedFormatModel>;
};

export type ValidDataAndFixedFormatModel = {
    db_type: string
    store: string
    fixedFormat: any
}

export type ValidRequestDataModel = {
    db_type: string
    store: string
    set: any
    where: any
}

export interface FromControllerRequestDataModel {
    db_type: string
    store_code: string
    feature: string
    set: any
    where: any
    field_list?: any
}