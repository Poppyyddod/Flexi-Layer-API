import { mongodb } from "@Configs/Database";
import { noSqlSupporterList } from "@Helper/Data/Center/list/list.nosql-supporter";




export const ValidateCollectionMapper = async (db_type: string, store_code: string) => {
    try {
        console.log('ValidateCollectionMapper :', db_type, store_code);

        await mongodb.client?.connect();

        const collectionsFromMongoDB = await mongodb.db?.listCollections().toArray();
        await mongodb.client?.close();

        const collections = collectionsFromMongoDB?.map((collection: any) => collection.name);
        console.log('ValidateCollectionMapper (collections) :', collections);

        const theCollectionIndex = collections?.indexOf(store_code);
        console.log('ValidateCollecetionMapper (theCollectionIndex) :', theCollectionIndex);

        if (theCollectionIndex !== -1) {
            const theCollection = collections?.[theCollectionIndex];

            return theCollection;
        }

        throw { kind: 'invalid_store_code' };
    } catch (error) {
        console.log('ValidateCollectionMapper (Error):', error);
        throw error;
    }
}


export const ValidateNosqlSupporter = async (noSqlSupporterRequestData: any, feature: string) => {
    try {
        console.log('ValidateNosqlSupporter :', noSqlSupporterRequestData, feature);

        console.log('ValidateNosqlSupporter (Request)(Feature) :', noSqlSupporterList[feature]);

        if (noSqlSupporterRequestData['ignore_supporter'])
            return undefined;

        Object.keys(noSqlSupporterRequestData).forEach((supporter: any) => {
            console.log('ValidateNosqlSupporter (Request)(supporter) :', supporter);

            if (!(supporter in noSqlSupporterList[feature]) && !(supporter in noSqlSupporterList['mix'])) {
                throw { kind: 'invalid_nosql_supporter_feature' };
            }

            if (noSqlSupporterList[feature][supporter]) {
                const isValidDataType = typeof noSqlSupporterRequestData[supporter] === noSqlSupporterList[feature][supporter]?.data_type;

                if (!isValidDataType) {
                    throw { kind: 'invalid_nosql_supporter_data_type' };
                }
            }
        });

        return noSqlSupporterRequestData;
    } catch (error) {
        console.log('ValidateNosqlSupporter (Error):', error);
        throw error;
    }
}