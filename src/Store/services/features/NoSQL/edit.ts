import { ValidateNosqlSupporter } from "@Helper/Query/NoSQL/validation";





export const EditNosqlStoreService = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('EditNosqlStoreService : ', validRequestData);
        const { FixWhereRequestFormat } = helper;
        const { nosql_supporter, feature } = validRequestData;

        if (nosql_supporter) {
            const validNoSqlSupporter = await ValidateNosqlSupporter(nosql_supporter, feature);
            console.log('EditNosqlStoreService (validNoSqlSupporter) : ', validNoSqlSupporter);

            validRequestData['nosql_supporter'] = validNoSqlSupporter;
        }

        const fixedRequestFormatData = await FixWhereRequestFormat(validRequestData);
        console.log('DeleteNosqlStoreService (fixedRequestFormatData) : ', fixedRequestFormatData);

        return fixedRequestFormatData;
    } catch (error) {
        console.log('EditNosqlStoreService (Error):', error);
        throw error;
    }
}