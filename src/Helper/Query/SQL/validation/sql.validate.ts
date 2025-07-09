
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

export const ValidateTableMapper = async (dbPositionData: any) => {
    try {
        console.log('* ValidateTableMapper (dbPositionData) :', dbPositionData);
        // Table Structure !!!!!!!!!!!!!!!!!
        // const cmd = await dataStructureQueryCmd[dbPositionData.db_type]; // <- Old
        // console.log('ValidateTableMapper (cmd) :', cmd);

        // Mapping Table Structure !!!!!!!!!!!!!!!!!
        // const tableDataStructure = await mappingMethodTableDataStructure[dbPositionData.db_type](dbPositionData, cmd);
        
        const tableDataStructure: IMySQLTableStructure[] = cachedTableStructure[dbPositionData.store];
        console.log("* ValidateTableMapper (tableDataStructure) : ", tableDataStructure);

        // console.log('ValidateTableMapper (tableDataStructure) : ', dbPositionData.db_type, tableDataStructure);

        // Ensure that 'fields' is an array of objects
        if (!Array.isArray(tableDataStructure) || tableDataStructure.length === 0) {
            console.log('* Table is not found in the database : ', dbPositionData.store);
            throw { kind: 'not_found_the_store' };
        }

        return tableDataStructure;
    } catch (error) {
        console.log('ValidateTableMapper (Error):', error);
        throw error;
    }
}

