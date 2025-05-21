import { mongodb } from "@Configs/Database";



export const FetchNosqlStoreRespo = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('FetchNosqlStoreRespo : ', validRequestData);

        const { } = helper;
        const { db_type, store, set, where } = validRequestData;
        console.log('FetchNosqlStoreRespo (validRequestData) : ', where);

        await mongodb.testConnection();
        const db = mongodb.client.db(process.env.MONGODB_DATABASE);

        const dataFromMongoDB = await db.collection(store).find(where).toArray();

        console.log('FetchNosqlStoreRespo (dataFromMongoDB) : ', dataFromMongoDB);

        if (dataFromMongoDB.length === 0) {
            if (where) throw { kind: 'not_found_data' };

            return { kind: 'null_data' };
        }

        return dataFromMongoDB;
    } catch (error) {
        console.log('FetchNosqlStoreRespo (Error):', error);
        throw error;
    }
}