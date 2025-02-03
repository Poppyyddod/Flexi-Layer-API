

export const FetchNosqlStoreService = (helper: any) => async (validRequestData: any) => {
    try {
        console.log('FetchNosqlStoreService : ', validRequestData);

        const { FixWhereRequestFormat } = helper;

        const fixedRequestFormatData = await FixWhereRequestFormat(validRequestData);
        console.log('FetchNosqlStoreService (fixedRequestFormatData) : ', fixedRequestFormatData);

        return fixedRequestFormatData;
    } catch (error) {
        console.log('FetchNosqlStoreService (Error):', error);
        throw error;
    }
}