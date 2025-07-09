import { sql } from "@Configs/Database";
import { IMySQLTableStructure } from "../Model/global.model";





/**
 * Cached list of all table names in the current MySQL database.
 */
export let cachedTables: string[] = [];

export const GetCachedTables = () => cachedTables;

/**
 * Fetches all table names from the connected MySQL database 
 * and stores them in the `cachedTables` array.
 * 
 * @returns {Promise<void>}
 */
export const MySqlTableNameCacher = async (): Promise<void> => {
    const [rows] = await sql.query(`SHOW TABLES`);
    const key = Object.keys(rows[0])[0];
    cachedTables = rows.map((row: any) => row[key]);
    // console.log("MySqlTableNameCacher (cachedTables) : ", cachedTables);
    console.log("✅ Cached MySQL table names successfully.");
};




/**
 * Cached table structure (columns info) of each table.
 * 
 * The structure is stored as:
 * {
 *   tableName: [{ field, type, comment }, ...]
 * }
 */
export let cachedTableStructure: Record<string, IMySQLTableStructure[]> = {};

export const GetCachedTableStructure = () => cachedTableStructure;

/**
 * Fetches the column structure for each cached table name
 * using `INFORMATION_SCHEMA.COLUMNS`, and stores the result
 * into `cachedTableStructure`.
 * 
 * This requires `cachedTables` to be initialized first.
 * 
 * @returns {Promise<void>}
 */
export const MySqlTableStructureCacher = async (): Promise<void> => {
    if (cachedTables.length === 0) return;

    const placeholders = cachedTables.map(() => '?').join(',');
    const query = `
        SELECT 
            TABLE_NAME AS tableName,
            COLUMN_NAME AS field, 
            COLUMN_TYPE AS type, 
            COLUMN_COMMENT AS comment 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME IN (${placeholders})
    `;

    const [rows] = await sql.query(query, cachedTables);

    // Reset caching
    cachedTableStructure = {};

    for (const row of rows) {
        const table = row.tableName;
        if (!cachedTableStructure[table]) {
            cachedTableStructure[table] = [];
        }

        cachedTableStructure[table].push({
            field: row.field,
            type: row.type,
            comment: row.comment || '',
        });
    }

    // console.log("MySqlTableStructureCacher (cachedTableStructure) : ", cachedTableStructure);
    console.log("✅ Cached MySQL table structure successfully.");
};





/**
 * Initializes the cache system by first caching all table names,
 * then caching the structure of each table.
 * 
 * This function is intended to be called once during server startup.
 * 
 * @returns {Promise<void>}
 */
let cacheReady = false;

export const CacheInitMySqlTableStructure = async (): Promise<void> => {
    try {
        await MySqlTableNameCacher();
        await MySqlTableStructureCacher();
        cacheReady = true;
    } catch (err) {
        console.error("❌ Cache Init Error:", err);
        throw err;
    }
};

export const isCacheReady = () => cacheReady;

