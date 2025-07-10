/**
 * Store Respository Model
 */

import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { IFixedToQueryFormat } from "./store.controller.model";
import { IStoreFeatureList } from "./store.global.model";

export interface ServiceMappedFeature {
    [feature: string]: RespositoryMethodsModel; // แต่ละ feature จะมี methods ครบ
}

// ສຳຫຼັບ Respository Key

// ສຳຫຼັບ Respository Methods
export type RespositoryMethodsModel = {
    [key in IStoreFeatureList]: (helpers: any) => (validRequestData: IMyRequestData, fixedFormat: IFixedToQueryFormat, feature: IStoreFeatureList) => Promise<void>
}

export type ValidAllDataFromService = {
    db_type: string;
    store: string;
    fixedFormat: any;
}