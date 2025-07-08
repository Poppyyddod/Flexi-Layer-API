
/**
 * @function CreateQueryForMySQL ສຳຫຼັບການສົ່ງ Query ໄປທີ່ MySQL
 * @param data 
 * @returns 
 */
export const CreateQueryForPostgreSQL = async (data: any) => {
    try {
        const { SQLmanagement, set, params, store, db_type } = data;

        const fields = set.split(', ').map((pair: any) => pair.split(' = ')[0]).join(', ');
        const placeholders = set.split(', ').map((pair: any) => pair.split(' = ')[1]).join(', ');

        const cmd = `INSERT INTO ${store} ${fields} RETURNING *;`;
        console.log('CreateStoreRespo (PostgreSQL)(cmd) : ', cmd);

        const newRecordData = await SQLmanagement(db_type, { cmd, params, isReturn: true });
        console.log('CreateStoreRespo (PostgreSQL)(newRecord): ', newRecordData);

        return newRecordData;
    } catch (error) {
        console.log('CreateStoreRespo (error)(PostgreSQL) : ', error);
        throw error;
    }
}