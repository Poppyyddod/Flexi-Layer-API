
/**
 * @function AuthSignUpController
 * @param helpers Object / ເປັນທີ່ເກັບ Helper Function ໄວ້ພາຍໃນ
 * @param reqBodyData Object / ແມ່ນ HTTP Request Body
 * @returns Object
 */

export const AuthSignUpController = (helpers: any) => async (reqBodyData: any) => {
    try {
        console.log('AuthSignUpController :', reqBodyData);

        const { } = helpers;

        const { db_type, store_code, set, where } = reqBodyData;
        const { email, user_name, secretword } = set;

        if (where) {
            delete reqBodyData['where'];
        }

        if (!db_type || !store_code || !set || (set && (!email || !user_name || !secretword))) {
            throw { kind: 'incomplete_request' };
        }

        console.log('AuthSignUpController (validRequestFormat) : ', reqBodyData);

        const dataToCenterController = {
            data: reqBodyData,
            feature: 'sign-up'
        }

        return dataToCenterController;
    } catch (error: any) {
        console.log('AuthSignUpController (Error):', error);

        if ((error?.table === 'user_privacy' && error?.code === '23505') || (reqBodyData.store_code === "user_privacy" && error?.sqlState === '23000')) {
            throw { kind: 'email_already_exist', feature: 'sign-up' };
        }

        throw { ...error, feature: 'sign-up' };
    }
}