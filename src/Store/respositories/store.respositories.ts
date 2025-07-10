import { SQLmanagement } from "@Helper/Query/SQL";
import { SqlStoreRespoMethods } from './features/methods';
import { IStoreFeatureList } from "../models/store.global.model";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { IFixedToQueryFormat } from "../models/store.controller.model";

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
    sql: async (validRequestData: IMyRequestData, fixedFormat: IFixedToQueryFormat, feature: IStoreFeatureList) => {
        try {
            console.log('StoreRespository (dbTypeRespository)(SQL):', validRequestData, fixedFormat, feature);

            const respository = SqlStoreRespoMethods[feature];
            const dataFromTheRespository = await respository(SqlHelperFunction)(validRequestData, fixedFormat, feature);
            // console.log('StoreRespository (dataFromTheRespository)(SQL) : ', dataFromTheRespository);

            return dataFromTheRespository;
        } catch (error) {
            console.log('StoreRespository (dbTypeRespository)(SQL)(Error):', error);
            throw error;
        }
    }
}



const StoreRespository = async (dbRelationshipType: string, feature: IStoreFeatureList, validRequestData: IMyRequestData, fixedFormat: IFixedToQueryFormat) => {
    try {
        console.log('StoreRespository : ', feature, validRequestData);
        // const { store, fixedFormat, db_type } = serviceData;

        const dataFromTheRespository = await dbTypeRespository[dbRelationshipType](validRequestData, fixedFormat, feature);
        console.log('StoreRespository (dataFromTheRespository) : ', dataFromTheRespository);

        return dataFromTheRespository;
    } catch (error) {
        console.log('StoreRespository (Error):', error);
        throw error;
    }
}

export default StoreRespository;
