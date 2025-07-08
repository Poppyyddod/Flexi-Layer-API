import { noSqlSupporterList } from "@Helper/Data/Center/list/list.nosql-supporter";

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