
// import { mappingMethodTableDataStructure } from '../mapping/table-data-structure/sql.method';
// import { dataStructureQueryCmd } from '../mapping/table-data-structure/sql.secretdata';
import { isArray, isObject, isString } from '@Helper/Utils';
import { IMySQLTableStructure } from '@SRC/Helper/Model/global.model';
import { cachedTableStructure } from '@SRC/Helper/Cache';






/**
 * @function ValidateTableMapper
 * For check store. is it mapped with the table? or The table does exist?.
 * @param dbPositionData - Key # db_type, db_store, feature
 * @returns Key # table data structure
 */

export const MapperTableStructure = async (storeCode: any): Promise<IMySQLTableStructure[]> => {
    try {
        console.log('* ValidateTableMapper (storeCode) :', storeCode);
        
        const tableDataStructure: IMySQLTableStructure[] = cachedTableStructure[storeCode];
        console.log("* ValidateTableMapper (tableDataStructure) : ", tableDataStructure);

        // console.log('ValidateTableMapper (tableDataStructure) : ', storeCode.db_type, tableDataStructure);

        // Ensure that 'fields' is an array of objects
        if (!Array.isArray(tableDataStructure) || tableDataStructure.length === 0) {
            console.log('* Table is not found in the database : ', storeCode);
            throw { kind: 'not_found_the_store' };
        }

        return tableDataStructure;
    } catch (error) {
        console.log('ValidateTableMapper (Error):', error);
        throw error;
    }
}

