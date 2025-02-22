import { ArgonComparePassword, JwtGenerateToken, SetCookieForJwtToken } from "@Helper/Utils/Helper.auth.utils";



/**
 * @function AuthSignInService
 * @param helpers Object / ເປັນທີ່ເກັບ Helper Function ໄວ້ພາຍໃນ
 * @param validRequestData Object / ເປັນ Request Body ທີ່ຖືກຕ້ອງຕາມກຳໜົດແລ້ວ
 * @param feature String / ສຳຫຼັບບົງບອກຄຸນສົມບັດຂອງການບໍລິການ
 * @returns Object
 */

/**
 * @function StoreService
 * ສຳຫຼັບການເອີ້ນໃຊ້ Store System ເພື່ອສົ່ງ Request ໄປດືງຂໍ້ມູນຕາມຄຳຂໍ
 */

/**
 * @function ArgonComparePassword
 * ສຳຫຼັບການກວດສອບ Hashed `Secretword` ຫຼື `Password` ແລ້ວກັບທີ່ສົ່ງມາກວດສອບ
 */

export const AuthSignInService = (helpers: any) => async (httpResponse: any, validRequestData: any, feature: string) => {
    try {
        console.log('AuthSignInService :', validRequestData);

        const { StoreService } = helpers;

        const { db_type, store_code, where } = validRequestData;
        const { email, secretword } = where;

        const dataToStoreServiceCenter = {
            db_type,
            store_code,
            where: {
                email
            }
        }

        const dataFromServiceCenter = await StoreService(dataToStoreServiceCenter, 'fetch');
        console.log('AuthSignInService (dataFromCenterService) : ', dataFromServiceCenter);

        const comparedPassword = await ArgonComparePassword(secretword, dataFromServiceCenter[0]['secretword']);
        console.log('AuthSignInService (comparedPassword) : ', comparedPassword);

        if (!comparedPassword) {
            throw { kind: 'incorrect_password' };
        }

        delete dataFromServiceCenter[0]['secretword'];

        const generatedToken = await JwtGenerateToken(dataFromServiceCenter[0]?.user_id);
        console.log('AuthSignInService (generatedToken) : ', generatedToken);

        dataFromServiceCenter[0]['token'] = generatedToken;

        // await SetCookieForJwtToken(httpResponse, generatedToken);

        const dataToCreateSignInHistory = {
            db_type,
            store_code: 'user_signin_history',
            set: {
                already_signed_in: 1,
                last_online_at: new Date().toISOString(),
                last_signed_in: new Date().toISOString()
            },
            where: {
                user_id: parseInt(dataFromServiceCenter[0]['user_id'])
            }
        };

        const dataUserSignInHistory = await StoreService(dataToCreateSignInHistory, 'edit');
        console.log('AuthSignUpService (dataUserSignInHistory) : ', dataUserSignInHistory);

        const dataToAuthServiceCenter = {
            response: {
                message: "Successfully signed in !!",
                data: dataFromServiceCenter
            },
            status_code: 200
        }

        return dataToAuthServiceCenter;
    } catch (error) {
        console.log('AuthSignInService (Error):', error);
        throw error;
    }
}