import { mongodb } from "@Configs/Database";
import { isArray } from "@Helper/Utils";



export const CreateNosqlStoreRespo = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('CreateNosqlStoreRespo : ', validRequestData);
        const { store, set, nosql_supporter } = validRequestData;

        if (nosql_supporter?.add_time_series) {
            if (!isArray(set)) {
                set['created_at'] = new Date();
                set['updated_at'] = null;
            } else {
                set.forEach((object: any) => {
                    object['created_at'] = new Date();
                    object['updated_at'] = null;
                })
            }
        }

        await mongodb.testConnection();

        const db = mongodb.client.db(process.env.MONGODB_DATABASE);

        const insertThisData = isArray(set) ? set : [set];

        console.log('CreateNosqlStoreRespo (insertThisData) : ', insertThisData);
        const result = await db.collection(store).insertMany(insertThisData);

        if (!result.acknowledged) throw { kind: 'mongodb_query_failed' };

        const insertedData = await db.collection(store)
            .find({ _id: { $in: Object.values(result.insertedIds) } })
            .toArray();

        console.log('CreateNosqlStoreRespo (insertedData) : ', insertedData);

        return insertedData;
    } catch (error) {
        console.log('CreateNosqlStoreRespo (Error):', error);
        throw error;
    }
}