
/**
 * @function AuthSignOutController
 * @param helpers Object / ເປັນທີ່ເກັບ Helper Function ໄວ້ພາຍໃນ
 * @param reqBodyData Object / ແມ່ນ HTTP Request Body
 * @returns Object
 */

export const AuthSignOutController = (helpers: any) => async (reqBodyData: any) => {
    try {
        console.log('AuthSignOutController :', reqBodyData);

        const { } = helpers;

        return reqBodyData;
    } catch (error) {
        console.log('AuthSignOutController (Error):', error);
        throw error;
    }
}