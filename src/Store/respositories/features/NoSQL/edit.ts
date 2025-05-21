// import { mongodb } from "@Configs/Database";





// export const EditNosqlStoreRespo = (helper: any) => async (validRequestData: any) => {
//     try {
//         console.log('EditNosqlStoreRespo : ', validRequestData);

//         const { db_type, store, feature, nosql_supporter, set, where } = validRequestData;

//         if (nosql_supporter?.update_time_series) {
//             set['updated_at'] = new Date();
//         }

//         await mongodb.client.connect();

//         const dataFromMongoDB = await mongodb.db.collection(store).updateMany(where, { $set: set });
//         await mongodb.client.close();

//         console.log('EditNosqlStoreRespo (dataFromMongoDB) : ', dataFromMongoDB);

//         if (!dataFromMongoDB.acknowledged) {
//             throw { kind: 'mongodb_query_failed' };
//         }

//         if (dataFromMongoDB.modifiedCount === 0) {
//             throw { kind: 'not_found_data' };
//         }

//         return {
//             affectedRows: dataFromMongoDB.modifiedCount
//         };
//     } catch (error) {
//         console.log('EditNosqlStoreRespo (Error):', error);
//         throw error;
//     }
// }

import { mongodb } from "@Configs/Database";

export const EditNosqlStoreRespo = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('EditNosqlStoreRespo : ', validRequestData);

        const { store, nosql_supporter, set, where } = validRequestData;

        if (nosql_supporter?.update_time_series) {
            set['updated_at'] = new Date();
        }

        await mongodb.testConnection();

        const db = mongodb.client.db(process.env.MONGODB_DATABASE);
        const result = await db.collection(store).updateMany(where, { $set: set });

        console.log('EditNosqlStoreRespo (dataFromMongoDB) : ', result);

        if (!result.acknowledged) throw { kind: 'mongodb_query_failed' };
        if (result.modifiedCount === 0) throw { kind: 'not_found_data' };

        return {
            affectedRows: result.modifiedCount
        };
    } catch (error) {
        console.log('EditNosqlStoreRespo (Error):', error);
        throw error;
    }
};
