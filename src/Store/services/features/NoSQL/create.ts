import { ValidateNosqlSupporter } from "@Helper/Query/NoSQL/validation";





export const CreateNosqlStoreService = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('CreateNosqlStoreService : ', validRequestData);

        const { nosql_supporter, feature } = validRequestData;

        if (nosql_supporter) {
            const validNoSqlSupporter = await ValidateNosqlSupporter(nosql_supporter, feature);
            console.log('CreateNosqlStoreService (validNoSqlSupporter) : ', validNoSqlSupporter);

            validRequestData['nosql_supporter'] = validNoSqlSupporter;
        }

        return validRequestData;
    } catch (error) {
        console.log('CreateNosqlStoreService (Error):', error);
        throw error;
    }
}