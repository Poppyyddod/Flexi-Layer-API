

type NoSQLmanagementFeature = 'find' | 'insertMany' | 'updateMany' | 'deleteMany';


export const NoSQLmanagement = async (validRequestData: any, feature: NoSQLmanagementFeature) => {
    try {
        console.log('[NoSQLmanagement] : ', validRequestData, feature);
    } catch (error) {
        console.log('NoSQLmanagement (Error):', error);
        throw error;
    }
}


export const StartValidateNoSqlRequestDataStructure = async (reqBodyData: any) => {
    try {
        console.log('StartValidateNoSqlRequestDataStructure :', reqBodyData);

        return true;
    } catch (error) {
        console.log('StartValidateNoSqlRequestDataStructure (Error):', error);
        throw error;
    }
}