import { SQLmanagement } from "@Helper/Query/SQL";
import { SqlStoreRespoMethods } from './features/methods';
import { RespositoryMethodsModel, RespositoryKeys } from "@Store/models/store.respository.model";
import { ValidDataAndFixedFormatModel } from "@Store/models/store.service.model";

/**
 * SQL Helper Functions
 */

const SqlHelperFunction = {
    SQLmanagement
};


/**
 * NoSQL Helper Functions
 */

const NoSqlHelperFunction = {

}


/**
 * @StoreRespository
 * ສຳຫຼັບ Method Mapping ເພື່ອເອີ້ນໃຊ້ Respository ຂອງແຕ່ລະ Feature
 */


const dbTypeRespository: any = {
    sql: async (serviceData: ValidDataAndFixedFormatModel, theFeature: RespositoryKeys) => {
        try {
            console.log('StoreRespository (dbTypeRespository)(SQL):', serviceData, theFeature);

            const respository = SqlStoreRespoMethods[theFeature];
            const dataFromTheRespository = await respository(SqlHelperFunction)({ ...serviceData });
            // console.log('StoreRespository (dataFromTheRespository)(SQL) : ', dataFromTheRespository);

            return dataFromTheRespository;
        } catch (error) {
            console.log('StoreRespository (dbTypeRespository)(SQL)(Error):', error);
            throw error;
        }
    }
}



const StoreRespository = async (dbRelationshipType: string, feature: string, serviceData: any) => {
    try {
        console.log('StoreRespository : ', serviceData, feature);
        // const { store, fixedFormat, db_type } = serviceData;
        const theFeature = feature as RespositoryKeys;

        const dataFromTheRespository = await dbTypeRespository[dbRelationshipType](serviceData, theFeature);
        // console.log('StoreRespository (dataFromTheRespository) : ', dataFromTheRespository);

        return dataFromTheRespository;
    } catch (error) {
        console.log('StoreRespository (Error):', error);
        throw error;
    }
}

export default StoreRespository;
