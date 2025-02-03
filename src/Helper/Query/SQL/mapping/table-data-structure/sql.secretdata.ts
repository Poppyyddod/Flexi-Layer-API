/**
 * @dataStructureQueryCmd
 * ສຳຫຼັບ `db_type` mapping ເອົາ cmd ສຳຫຼັບການດືງຂໍ້ມູນຈາກ Database => (field, data type, comment)
 */

export const dataStructureQueryCmd: any = {
    postgresql: `
        SELECT 
            c.column_name AS field,
            c.data_type AS type,
            COALESCE(pgd.description, '') AS comment
        FROM 
            information_schema.columns c
        LEFT JOIN 
            pg_catalog.pg_description pgd 
            ON pgd.objsubid = c.ordinal_position
            AND pgd.objoid = (
                SELECT oid 
                FROM pg_catalog.pg_class 
                WHERE relname = c.table_name 
                AND relnamespace = (
                    SELECT oid 
                    FROM pg_catalog.pg_namespace 
                    WHERE nspname = c.table_schema
                )
            )
        WHERE 
            c.table_name = $1
            AND c.table_schema = current_schema();
            `,

    mysql: `
            SELECT 
                COLUMN_NAME AS field, 
                COLUMN_TYPE AS type, 
                COLUMN_COMMENT AS comment 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = ?
            AND TABLE_SCHEMA = DATABASE();
            `,
}