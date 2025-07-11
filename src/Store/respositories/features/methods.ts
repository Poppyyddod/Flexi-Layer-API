import { FetchSqlStoreRespo, CreateSqlStoreRespo, EditSqlStoreRespo, DeleteSqlStoreRespo } from './SQL';
import { RespositoryMethodsModel } from '@Store/models/store.respository.model';


/**
 * @SqlStoreRespoMethods
 * ສຳຫຼັບເກັບ Methods ຂອງ Responsitory ແຕ່ລະ Feature (SQL)
 */

export const SqlStoreRespoMethods: RespositoryMethodsModel = {
    'fetch': (helpers) => { return FetchSqlStoreRespo(helpers) },
    'create': (helpers) => { return CreateSqlStoreRespo(helpers) },
    'edit': (helpers) => { return EditSqlStoreRespo(helpers) },
    'delete': (helpers) => { return DeleteSqlStoreRespo(helpers) }
};
