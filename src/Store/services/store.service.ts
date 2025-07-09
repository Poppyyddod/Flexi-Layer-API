import StoreRespository from '@Store/respositories';
import { FixRequestFormat, FixWhereRequestFormat } from '@Store/utils';
import { CheckTableDataStructure } from '@Store/validation';
import { SqlServiceMethods } from './features/methods';
import { FromControllerRequestDataModel, ServiceKeys } from '@Store/models/store.service.model';
import { DbTypeListKey, supportForDbTypes } from '@Helper/Data/Center/list/list.db-type.support';


/**
 * SQL Helper Functions
 */

const SqlHelperFunctions = {
    FixRequestFormat,
    // CheckTableDataStructure,
    // StoreRespository
};


/**
 * NoSQL Helper Functions
 */

const NoSqlHelperFunction = {
    FixWhereRequestFormat,
}


/**
 * @function StoreService - ສຳຫຼັບ Methods Mapping ຂອງ Service ແຕ່ລະ Feature
 * @param request - Request Body
 * @param feature - Feature such as ('fetch', 'create', 'edit', 'remove')
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
    sql: async (reqBodyData: FromControllerRequestDataModel, dbRelationshipType: string, theFeature: ServiceKeys) => {
        try {
            const validData = await CheckTableDataStructure({ ...reqBodyData, feature: theFeature });
            console.log('StoreService (validData)(SQL) : ', validData);

            const serviceMappedMethod = SqlServiceMethods[theFeature];
            const dataFromtheService = await serviceMappedMethod(SqlHelperFunctions)(validData);
            // console.log('StoreService (dataFromtheService)(SQL) : ', dataFromtheService);

            const { db_type, store, fixedFormat } = dataFromtheService;

            const dataToResposCenter = {
                ...validData,
                fixedFormat
            };

            const dataFromResposCenter = await StoreRespository(dbRelationshipType, theFeature, dataToResposCenter);
            // console.log('StoreService (dataFromResposCenter)(SQL) : ', dataFromResposCenter);

            return dataFromResposCenter;
        } catch (error) {
            console.log('StoreService (dbTypeService)(SQL) : ', error);
            throw error;
        }
    }
}


const StoreService = async (reqBodyData: FromControllerRequestDataModel, feature: string) => {
    try {
        console.log('> StoreService Request Data :', reqBodyData, feature);
        const theFeature = feature as ServiceKeys;
        // console.log(`Request route: ${route}`);
        // console.log('> StoreService :', theFeature);

        const { db_type } = reqBodyData;

        const dbRelationshipType = supportForDbTypes[db_type as DbTypeListKey].type;
        const dataFromResposCenter = await dbTypeService[dbRelationshipType](reqBodyData, dbRelationshipType, theFeature);
        console.log('StoreService (dataFromResposCenter) : ', dataFromResposCenter);

        return dataFromResposCenter;
    } catch (error) {
        console.log('StoreService (Error):', error);
        throw error;
    }
}

export default StoreService;
