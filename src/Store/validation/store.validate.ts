
import { StoreMapping } from '@Store/utils';
import { StartValidateSqlRequestDataStructure } from '@Helper/Query/SQL';
import { FromControllerRequestDataModel } from '@Store/models/store.service.model';
import { ValidateCollectionMapper } from '@Helper/Query/NoSQL/validation';
import { StartValidateNoSqlRequestDataStructure } from '@Helper/Query/NoSQL/no-sql.management';
import { isArray, isObject, isString } from '@Helper/Utils';
import { ValidateTableMapper } from '@Helper/Query/SQL/validation';


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


const CheckFieldListFieldName = async (tableDataStructure: any, field_list: any) => {
    try {
        console.log('> CheckFieldListFieldName :', tableDataStructure, field_list);

        // ดึงเฉพาะชื่อ field จาก tableDataStructure
        const existingFields = new Set(tableDataStructure.map((data: any) => data.field));

        // ตรวจสอบ field_list ว่ามีอยู่ใน tableDataStructure หรือไม่
        const invalidFields = field_list.filter((field: any) => !existingFields.has(field));

        if (invalidFields.length > 0) {
            console.log(`❌ Field(s) not found in table structure:`, invalidFields);
            throw { kind: 'field_list_child_error' };
        }
    } catch (error) {
        console.log('CheckFieldListFieldName (Error):', error);
        throw error;
    }
}


export const CheckTableDataStructure = async (dataFromServiceCenter: FromControllerRequestDataModel) => {
    try {
        console.log('CheckTableDataStructure :', dataFromServiceCenter);

        const { db_type, store_code, feature, set, where, field_list } = dataFromServiceCenter;

        const theStore = await StoreMapping(db_type, store_code);
        console.log('* Store (Mapped) : ', theStore);

        const dbPositionData = {
            store: theStore,
            db_type,
            feature
        };

        // const dataToCheckFieldAndType = {
        //     where: isObject(where) ? { ...where } : where,
        //     ...set
        // }

        const tableDataStructure = await ValidateTableMapper(dbPositionData);
        console.log('StartValidateSqlRequestDataStructure (tableDataStructure):', tableDataStructure);

        if (field_list && isArray(field_list)) {
            await CheckFieldListFieldName(tableDataStructure, field_list);
        }

        const isValidFieldsAndType = await StartValidateSqlRequestDataStructure(dbPositionData, tableDataStructure, {set, where});
        console.log('* Checked data key and data type : ', isValidFieldsAndType);

        if (!isValidFieldsAndType) {
            throw { kind: 'invalid_data_type' };
        }

        const dataToService = {
            store: theStore,
            ...dataFromServiceCenter
        };

        return dataToService;
    } catch (error) {
        console.log('CheckTableDataStructure (Error):', error);
        throw error;
    }
}



/**
 * @function CheckCollectionDataStructure - ສຳຫຼັບການກວດສອບຄວາມຖືກຕ້ອງຂອງ Store/Table name, Fields, Data Type ຂອງ Request
 * @param request - Request Body
 * @returns Object
 * @throws {Error}
 */

/**
 * 
 * @function ValidateCollectionMapper
 * ສຳຫຼັບການກວດສອບ Store/Table name
 * ຄືນຄ່າເປັນ String (ຊື່ຂອງ collection)
 */

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