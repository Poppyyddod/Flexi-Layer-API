import StoreRespository from '@Store/respositories';
import { FixRequestFormat } from '@Store/utils';
import { CheckTableDataStructure } from '@Store/validation';
import { SqlServiceMethods } from './features/methods';
import { DbTypeListKey, supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';
import { IMyRequestData } from '@SRC/Helper/Model/global.model';
import { IStoreFeatureList } from '../models/store.global.model';
import { IStoreReturnToServiceCenter } from '../models/store.controller.model';
import { FixJoinFormatRequest } from '../utils/join.table';


/**
 * SQL Helper Functions
 */

const SqlHelperFunctions = {
    FixRequestFormat,
    FixJoinFormatRequest
    // CheckTableDataStructure,
    // StoreRespository
};


/**
 * NoSQL Helper Functions
 */



/**
 * @function StoreService - ສຳຫຼັບ Methods Mapping ຂອງ Service ແຕ່ລະ Feature
 * @param request - Request Body
 * @param feature - Feature such as ('fetch', 'create', 'edit', 'delete')
 * @returns - Object ທີ່ມາຈາກ Service Feature Function
 * @throws {Error}
 */

/**
 * 
 * @function SqlServiceMethods
 * ທີ່ເກັບ Service Methods
 */

/**
 * 
 * @function CheckTableDataStructure
 * ສຳຫຼັບການກວດສອບ Store/Table, Fields ແລະ Data type ວ່າກົງຕາມທີ່ກຳໜົດແລ້ວ ຫຼື ບໍ
 */

/**
 * @function StoreRespository
 * ສຳຫຼັບການສື່ສານກັບ Database
 */

/**
 * @ServiceKeys
 * ເປັນ Model ສຳຫຼັບ Service Feature Parameter
 */


const dbTypeService: any = {
    sql: async (validRequestData: IMyRequestData, dbRelationshipType: string, feature: IStoreFeatureList) => {
        try {
            const validStructureData = await CheckTableDataStructure(validRequestData, feature);
            console.log('StoreService (validData)(SQL) : ', validStructureData);

            const serviceMappedMethod = SqlServiceMethods[feature];
            const dataFromtheService: IStoreReturnToServiceCenter = await serviceMappedMethod(SqlHelperFunctions)(validRequestData);
            console.log('StoreService (dataFromtheService)(SQL) : ', dataFromtheService.fixedFormat);

            const { fixedFormat } = dataFromtheService;

            const dataFromResposCenter: any = await StoreRespository(dbRelationshipType, feature, validStructureData, fixedFormat);
            // console.log('StoreService (dataFromResposCenter)(SQL) : ', dataFromResposCenter);

            return dataFromResposCenter;
        } catch (error) {
            console.log('StoreService (dbTypeService)(SQL) : ', error);
            throw error;
        }
    }
}


const StoreService = async (validRequestData: IMyRequestData, feature: IStoreFeatureList) => {
    try {
        console.log('> StoreService Request Data :', validRequestData, feature);

        // console.log(`Request route: ${route}`);
        // console.log('> StoreService :', theFeature);

        const { db_type } = validRequestData;

        const dbRelationshipType: string = supportForDbTypes[db_type as DbTypeListKey].type;
        const dataFromResposCenter = await dbTypeService[dbRelationshipType](validRequestData, dbRelationshipType, feature);
        console.log('StoreService (dataFromResposCenter) : ', dataFromResposCenter);

        return dataFromResposCenter;
    } catch (error) {
        console.log('StoreService (Error):', error);
        throw error;
    }
}

export default StoreService;
