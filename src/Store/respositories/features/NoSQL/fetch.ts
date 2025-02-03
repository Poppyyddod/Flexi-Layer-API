import { mongodb } from "@Configs/Database";



export const FetchNosqlStoreRespo = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('FetchNosqlStoreRespo : ', validRequestData);

        await mongodb.client.connect();

        const { } = helper;
        const { db_type, store, set, where } = validRequestData;
        console.log('FetchNosqlStoreRespo (validRequestData) : ', where);

        const dataFromMongoDB = await mongodb.db.collection(store).find(where).toArray();
        await mongodb.client.close();

        console.log('FetchNosqlStoreRespo (dataFromMongoDB) : ', dataFromMongoDB);

        return dataFromMongoDB;
    } catch (error) {
        console.log('FetchNosqlStoreRespo (Error):', error);
        throw error;
    }
}