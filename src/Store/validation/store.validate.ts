
import { MapperStore } from '@Store/utils';
import { StartValidateSqlRequestDataStructure } from '@Helper/Query/SQL';
import { isArray } from '@Helper/Utils';
import { MapperTableStructure } from '@Helper/Query/SQL/validation';
import { IMyRequestData, IMySQLTableStructure } from '@SRC/Helper/Model/global.model';
import { IStoreFeatureList } from '../models/store.global.model';


/**
 * @function CheckTableDataStructure - ສຳຫຼັບການກວດສອບຄວາມຖືກຕ້ອງຂອງ Store/Table name, Fields, Data Type ຂອງ Request
 * @param request - Request Body
 * @returns Object
 * @throws {Error}
 */

/**
 * 
 * @function MapperStore
 * ສຳຫຼັບການກວດສອບ Store/Table name
 */

/**
 * 
 * @function StartCheckRequestDataStructure
 * ສຳຫຼັບການກວດສອບຄວາມຖືກຕ້ອງຂອງ Fields ແລະ Data Type
 */


const CheckFieldListFieldName = (validRequestData: IMyRequestData, tableDataStructure: IMySQLTableStructure[], field_list: string[]): void => {
    try {
        console.log('> CheckFieldListFieldName :', tableDataStructure, field_list);
        if (validRequestData.join) return;

        CheckFieldListWithoutJoin(tableDataStructure, field_list);
    } catch (error) {
        console.log('CheckFieldListFieldName (Error):', error);
        throw error;
    }
}

const CheckFieldListWithoutJoin = (tableDataStructure: IMySQLTableStructure[], field_list: string[]) => {
    // ดึงเฉพาะชื่อ field จาก tableDataStructure
    const existingFields = new Set(tableDataStructure.map((data: IMySQLTableStructure) => data.field));

    // ตรวจสอบ field_list ว่ามีอยู่ใน tableDataStructure หรือไม่
    const invalidFields = field_list.filter((fieldName: string) => !existingFields.has(fieldName));

    if (invalidFields.length > 0) {
        console.log(`❌ Field(s) not found in table structure:`, invalidFields);
        throw { kind: 'field_list_child_error' };
    }
}


export const CheckTableDataStructure = async (validRequestData: IMyRequestData, feature: IStoreFeatureList) => {
    try {
        console.log('CheckTableDataStructure :', validRequestData);

        const { db_type, store_code, set, where, field_list } = validRequestData;

        // Map store
        const storeCode: string = await MapperStore(db_type, store_code);
        console.log('* Store (Mapped) : ', storeCode);

        // Map table structure
        const tableDataStructure: IMySQLTableStructure[] = await MapperTableStructure(store_code);
        console.log('StartValidateSqlRequestDataStructure (tableDataStructure):', tableDataStructure);

        // Check field list
        if (field_list && isArray(field_list))
            CheckFieldListFieldName(validRequestData, tableDataStructure, field_list);

        // Check data key and data type
        const isValidFieldsAndType: boolean = StartValidateSqlRequestDataStructure(feature, tableDataStructure, validRequestData);
        console.log('* Checked data key and data type : ', isValidFieldsAndType);

        // Throw error if invalid data type
        if (!isValidFieldsAndType)
            throw { kind: 'invalid_data_type' };

        const dataToServiceCenter = {
            ...validRequestData
        };

        return dataToServiceCenter;
    } catch (error) {
        console.log('CheckTableDataStructure (Error):', error);
        throw error;
    }
}