import { FetchSqlStoreRespo, CreateSqlStoreRespo, EditSqlStoreRespo, DeleteSqlStoreRespo } from './SQL';
import { FetchNosqlStoreRespo, CreateNosqlStoreRespo, EditNosqlStoreRespo, DeleteNosqlStoreRespo } from './NoSQL';
import { RespositoryMethodsModel } from '@Store/models/store.respository.model';


/**
 * @SqlStoreRespoMethods
 * ສຳຫຼັບເກັບ Methods ຂອງ Responsitory ແຕ່ລະ Feature (SQL)
 */

export const SqlStoreRespoMethods: RespositoryMethodsModel = {
    'fetch': (helpers) => { return FetchSqlStoreRespo(helpers) },
    'create': (helpers) => { return CreateSqlStoreRespo(helpers) },
    'edit': (helpers) => { return EditSqlStoreRespo(helpers) },
    'remove': (helpers) => { return DeleteSqlStoreRespo(helpers) }
};


/**
 * @NoSqlStoreRespoMethods
 * ສຳຫຼັບເກັບ Methods ຂອງ Responsitory ແຕ່ລະ Feature (NoSQL)
 */

export const NoSqlStoreRespoMethods: any = {
    'fetch': (helpers: any) => { return FetchNosqlStoreRespo(helpers) },
    'create': (helpers: any) => { return CreateNosqlStoreRespo(helpers) },
    'edit': (helpers: any) => { return EditNosqlStoreRespo(helpers) },
    'remove': (helpers: any) => { return DeleteNosqlStoreRespo(helpers) }
};