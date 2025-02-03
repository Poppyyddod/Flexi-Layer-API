import { mongodb } from "@Configs/Database";





export const DeleteNosqlStoreRespo = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('DeleteNosqlStoreRespo : ', validRequestData);
        const { store, where } = validRequestData;

        await mongodb.client.connect();

        const result = await mongodb.db.collection(store).deleteMany(where);
        await mongodb.client.close();

        if (!result.acknowledged) {
            throw { kind: 'mongodb_delete_failed' };
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