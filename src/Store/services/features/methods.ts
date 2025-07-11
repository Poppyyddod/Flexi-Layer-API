import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { FetchSqlStoreService, CreateSqlStoreService, EditSqlStoreService, DeleteSqlStoreService } from "./SQL";
import { IStoreReturnToServiceCenter } from "@SRC/Store/models/store.controller.model";
import { IStoreFeatureList } from "@SRC/Store/models/store.global.model";
// import { ServiceMethodsModel } from '@Store/models/store.service.model';

// Model List ສຳຫຼັບ Service features

// Model ໃຫ້ການບໍລິການສົ່ງຂໍ້ມູນກັບມາເປັນແບບເທົ່ານັ້ນ DataToServiceCenterModel
export type ServiceMethodsModel = {
    [key in IStoreFeatureList]: (helpers: any) => (validRequestData: IMyRequestData) => Promise<IStoreReturnToServiceCenter>;
};

export const SqlServiceMethods: ServiceMethodsModel = {
    'fetch': (helpers: any) => {
        return FetchSqlStoreService(helpers);
    },

    'create': (helpers: any) => {
        return CreateSqlStoreService(helpers);
    },

    'edit': (helpers: any) => {
        return EditSqlStoreService(helpers);
    },

    'delete': (helpers: any) => {
        return DeleteSqlStoreService(helpers);
    }
};