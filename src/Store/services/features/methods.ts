import { FetchSqlStoreService, CreateSqlStoreService, EditSqlStoreService, RemoveSqlStoreService } from "./SQL";
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