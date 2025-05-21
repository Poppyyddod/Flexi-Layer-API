import { mongodb } from "@Configs/Database";





export const DeleteNosqlStoreRespo = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('DeleteNosqlStoreRespo : ', validRequestData);
        const { store, where } = validRequestData;

        await mongodb.testConnection();
        const db = mongodb.client.db(process.env.MONGODB_DATABASE);

        const result = await db.collection(store).deleteMany(where);

        if (!result.acknowledged) {
            throw { kind: 'mongodb_query_failed' };
        }

        if (result.deletedCount === 0) {
            throw { kind: 'not_found_data' };
        }

        console.log('DeleteNosqlStoreRespo (result) : ', result.deletedCount);

        return { store, affectedRows: result.deletedCount };
    } catch (error) {
        console.log('DeleteNosqlStoreRespo (Error):', error);
        throw error;
    }
}