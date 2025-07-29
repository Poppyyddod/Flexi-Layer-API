import { SQLmanagementModel } from './sql.model';
import { ValidateFieldsAndType, ValidateFieldsBeforeInsert } from './validation';
import { MapSqlQuery } from './sql.mapper.query';
import { IStoreFeatureList } from '@SRC/Store/models/store.global.model';
import { IMyRequestData, IMySQLTableStructure } from '@SRC/Helper/Model/global.model';





/**
 * @function StartCheckRequestDataStructure - For check the request before query to database
 * @param dbPositionData - Key (db_type, db_store, feature)
 * @param data - Request Body (set, where)
 * @returns {Boolean}
 * @throws {Error}
 */

/**
 * 
 * @function ValidateFieldsBeforeInsert
 * For check `request field`. is it valid as the `table structure` before `insert` query to database
 * @returns {Key}
 */

/**
 * 
 * @function ValidateFieldsAndType
 * For check the request `Fields` and `Data Type`. is it valid as requirement(table structure)
 * @returns {Boolean}
 */

export const StartValidateSqlRequestDataStructure = (feature: IStoreFeatureList, tableDataStructure: IMySQLTableStructure[], validRequestData: IMyRequestData): boolean => {
    try {
        const { set, where } = validRequestData;

        console.log('StartValidateSqlRequestDataStructure :', feature, set, where);

        if (set && feature === 'create')
            ValidateFieldsBeforeInsert(tableDataStructure, set);

        const isValidDataKeyAndType = ValidateFieldsAndType(tableDataStructure, validRequestData);
        console.log('StartValidateSqlRequestDataStructure (isValidDataKeyAndType):', isValidDataKeyAndType);

        return isValidDataKeyAndType;
        // return true;
    } catch (error) {
        console.log('StartCheckRequestDataStructure (Error):', error);
        throw error;
    }
};



/**
 * @function SQLmanagement - ສຳຫຼັບການສົ່ງຂໍ້ມູນໄປ Query ເພື່ອຈັດການກັບຂໍ້ມູນຕາມທີ່ Request
 * @param params
 * @returns {Object | Boolean}
 * @throws {Error}
 */

/**
 * 
 * @function CheckResponseSqlData
 * ສຳຫຼັບການກວດສອບຂໍ້ມູນທີ່ສົ່ງຄືນມາຈາກ SQL
 * @returns {Object | Boolean}
 */

/**
 * 
 * @SQLmanagementModel Interface
 * ໄວ້ລະບຸປະເພດຂອງຂໍ້ມູນໃນ Object ທີ່ສົ່ງມາ
 */


export const SQLmanagement = async (db_type: string, { cmd, params, isReturn }: SQLmanagementModel): Promise<any> => {
    try {
        console.log("[SQLmanagement] : ", cmd, params, isReturn);
        const checkReturnSqlData = await MapSqlQuery[db_type]({ cmd, params, isReturn });
        console.log('checkingReturn (SQLmanagement) : ', checkReturnSqlData);

        return checkReturnSqlData;
    } catch (error) {
        console.log('SQLmanagement (Error):', error);
        throw error;
    }
};