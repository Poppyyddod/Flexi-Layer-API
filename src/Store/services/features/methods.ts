import { FetchSqlStoreService, CreateSqlStoreService, EditSqlStoreService, RemoveSqlStoreService } from "./SQL";
import { FetchNosqlStoreService, CreateNosqlStoreService, EditNosqlStoreService, DeleteNosqlStoreService } from "./NoSQL";
import { ServiceMethodsModel } from '@Store/models/store.service.model';

/**
 * @StoreServiceMethods
 * ສຳຫຼັບການເກັບ Methods ຂອງ Service ແຕ່ລະ Feature
 */

export const SqlServiceMethods: ServiceMethodsModel = {
    'fetch': (helpers) => {
        return FetchSqlStoreService(helpers);
    },

    'create': (helpers) => {
        return CreateSqlStoreService(helpers);
    },

    'edit': (helpers) => {
        return EditSqlStoreService(helpers);
    },

    'remove': (helpers) => {
        return RemoveSqlStoreService(helpers);
    }
};


export const NoSqlServiceMethods: any = {
    'fetch': (helpers: any) => {
        return FetchNosqlStoreService(helpers);
    },

    'create': (helpers: any) => {
        return CreateNosqlStoreService(helpers);
    },

    'edit': (helpers: any) => {
        return EditNosqlStoreService(helpers);
    },

    'remove': (helpers: any) => {
        return DeleteNosqlStoreService(helpers);
    }
};