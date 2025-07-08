import { sql } from "@Configs/Database";


/**
 * @tableDataStructure
 * ສຳຫຼັບ `db_type` mapping ເພື່ອເອີ້ນໃຊ້ method ຂອງໃຜມັນເພື່ອດືງເອົາຂໍ້ມູນຈາກ Database
 */

/**
 * @method [db_type]
 * @param dbPositionData - key(db_type, store, feature)
 * @param cmd - string #ຄຳສັ່ງທີ່ map ມາແລ້ວຈາກ @dataStructureQueryCmd
 */

export const mappingMethodTableDataStructure: any = {
    mysql: async (dbPositionData: any, cmd: string) => {
        const [fields]: any[] = await sql.query(cmd, [dbPositionData.store]);
        // console.log(`MySQL ${dbPositionData.store} data structure : `, fields);

        return fields;
    },
}