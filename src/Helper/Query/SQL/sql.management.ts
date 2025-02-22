import { SQLmanagementModel } from './sql.model';
import { ValidateFieldsAndType, ValidateTableMapper, ValidateFieldsBeforeInsert } from './validation';
import { dbTypeSqlManagement } from './mapping/management';





/**
 * @function StartCheckRequestDataStructure - For check the request before query to database
 * @param dbPositionData - Key (db_type, db_store, feature)
 * @param data - Request Body (set, where)
 * @returns {Boolean}
 * @throws {Error}
 */

/**
 * 
 * @function ValidateTableMapper
 * For check store. is it mapped with the table? or The table does exist?.
 * @returns {Key}
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

export const StartValidateSqlRequestDataStructure = async (dbPositionData: any, data: any): Promise<any> => {
    try {
        console.log('StartCheckRequestDataStructure :', dbPositionData, data);

        const tableDataStructure = await ValidateTableMapper(dbPositionData);
        console.log('StartValidateSqlRequestDataStructure (tableDataStructure):', tableDataStructure);

        if (dbPositionData.feature === 'create') {
            await ValidateFieldsBeforeInsert(tableDataStructure, data);
        }

        const isValidDataKeyAndType = await ValidateFieldsAndType(tableDataStructure, data);
        console.log('isValidDataStructure (StartCheckRequestDataStructure):', isValidDataKeyAndType);

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
        const checkReturnSqlData = await dbTypeSqlManagement[db_type]({ cmd, params, isReturn });
        console.log('checkingReturn (SQLmanagement) : ', checkReturnSqlData);

        return checkReturnSqlData;
    } catch (error) {
        console.log('SQLmanagement (Error):', error);
        throw error;
    }
};