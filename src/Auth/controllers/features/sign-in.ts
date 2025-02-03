
/**
 * @function AuthSignInController
 * @param helpers Object / ເປັນທີ່ເກັບ Helper Function ໄວ້ພາຍໃນ
 * @param reqBodyData Object / ແມ່ນ HTTP Request Body
 * @returns Object
 */


export const AuthSignInController = (helpers: any) => async (reqBodyData: any) => {
    try {
        console.log('AuthSignInController :', reqBodyData);

        const { db_type, store_code, where } = reqBodyData;

        if (!db_type || !store_code || !where
            || ((!where?.email || !where?.secretword))
        ) {
            throw { kind: 'incomplete_request' };
        }

        // const { } = helpers;

        console.log('AuthSignInController (validRequestFormat) : ', reqBodyData);

        const dataToCenterController = {
            data: reqBodyData,
            feature: 'sign-in'
        }

        return dataToCenterController;
    } catch (error: any) {
        console.log('AuthSignInController (Error):', error);
        throw { ...error, feature: 'sign-in' };
    }
}