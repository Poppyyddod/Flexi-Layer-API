
import { StoreMapping } from '@Store/utils';
import { StartValidateSqlRequestDataStructure } from '@Helper/Query/SQL';
import { FromControllerRequestDataModel } from '@Store/models/store.service.model';
import { ValidateCollectionMapper } from '@Helper/Query/NoSQL/validation';
import { StartValidateNoSqlRequestDataStructure } from '@Helper/Query/NoSQL/no-sql.management';


/**
 * @function CheckTableDataStructure - ສຳຫຼັບການກວດສອບຄວາມຖືກຕ້ອງຂອງ Store/Table name, Fields, Data Type ຂອງ Request
 * @param request - Request Body
 * @returns Object
 * @throws {Error}
 */

/**
 * 
 * @function StoreMapping
 * ສຳຫຼັບການກວດສອບ Store/Table name
 */

/**
 * 
 * @function StartCheckRequestDataStructure
 * ສຳຫຼັບການກວດສອບຄວາມຖືກຕ້ອງຂອງ Fields ແລະ Data Type
 */


export const CheckTableDataStructure = async (dataFromServiceCenter: FromControllerRequestDataModel) => {
    try {
        console.log('CheckTableDataStructure :', dataFromServiceCenter);

        const { db_type, store_code, feature, set, where } = dataFromServiceCenter;

        const theStore = await StoreMapping(db_type, store_code);
        console.log('* Store (Mapped) : ', theStore);

        const dbPositionData = {
            store: theStore,
            db_type,
            feature
        };

        const isValidFieldsAndType = await StartValidateSqlRequestDataStructure(dbPositionData, { ...where, ...set });
        console.log('* Checked data key and data type : ', isValidFieldsAndType);

        if (!isValidFieldsAndType) {
            throw { kind: 'invalid_data_type' };
        }

        const dataToService = {
            store: theStore,
            where,
            set,
            db_type
        };

        return dataToService;
    } catch (error) {
        console.log('CheckTableDataStructure (Error):', error);
        throw error;
    }
}



export const CheckCollectionDataStructure = async (dataFromServiceCenter: any) => {
    try {
        console.log('CheckCollectionDataStructure : ', dataFromServiceCenter);

        const { db_type, store_code, feature, set, where, nosql_supporter } = dataFromServiceCenter;

        const theStore = await ValidateCollectionMapper(db_type, store_code);
        console.log('* Store (Mapped) : ', theStore);

        // const validData = await StartValidateNoSqlRequestDataStructure(dataFromServiceCenter);

        const dataToServiceCenter = {
            db_type,
            store: theStore,
            feature,
            set,
            where,
            nosql_supporter
        };

        return dataToServiceCenter;
    } catch (error) {
        console.log('CheckCollectionDataStructure (Error):', error);
        throw error;
    }
}