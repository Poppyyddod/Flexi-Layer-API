
/**
 * @function AuthSignOutController
 * @param helpers Object / ເປັນທີ່ເກັບ Helper Function ໄວ້ພາຍໃນ
 * @param reqBodyData Object / ແມ່ນ HTTP Request Body
 * @returns Object
 */


export const AuthSignOutController = (helpers: any) => async (reqBodyData: any) => {
    try {
        console.log('AuthSignOutController :', reqBodyData);

        const { db_type, store_code, where } = reqBodyData;

        if (!db_type || !store_code || !where || (where && !where.user_id)) {
            throw { kind: 'incomplete_request' };
        }

        // const { } = helpers;

        console.log('AuthSignOutController (validRequestFormat) : ', reqBodyData);

        const dataToCenterController = {
            data: reqBodyData,
            feature: 'sign-out'
        }

        return dataToCenterController;
    } catch (error: any) {
        console.log('AuthSignOutController (Error):', error);
        throw { ...error, feature: 'sign-out' };
    }
}