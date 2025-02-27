import { ArgonHashPassword } from "@Helper/Utils/Helper.auth.utils";



/**
 * @function AuthSignUpService
 * @param helpers Object / ເປັນທີ່ເກັບ Helper Function ໄວ້ພາຍໃນ
 * @param validRequestData Object / ເປັນ Request Body ທີ່ຖືກຕ້ອງຕາມກຳໜົດແລ້ວ
 * @param feature String / ສຳຫຼັບບົງບອກຄຸນສົມບັດຂອງການບໍລິການ
 * @returns Object
 */

/**
 * @function ArgonHashPassword
 * ສຳຫຼັບການ Hash `secretword` ຫຼື `password`
 */

/**
 * @function StoreService
 * ສຳຫຼັບການເອີ້ນໃຊ້ Store System ເພື່ອສົ່ງ Request ໄປເພື່ອສ້າງບັນຊີຜູ້ໃຊ້
 */

export const AuthSignUpService = (helpers: any) => async (httpResponse: any, validRequestData: any, feature: string) => {
    try {
        console.log('AuthSignUpService :', validRequestData);

        const { StoreService } = helpers;

        const { db_type, store_code, set } = validRequestData;
        const { email, user_name, secretword } = set;

        const hashedPassword = await ArgonHashPassword(secretword);
        console.log('AuthSignUpService (hashedPassword) : ', hashedPassword);
        set['secretword'] = hashedPassword;

        const dataFromCenterServiceCreate = await StoreService(validRequestData, 'create');
        console.log('AuthSignUpService (dataFromCenterService) : ', dataFromCenterServiceCreate);

        // ລົບ secretword (password) ອອກກ່ອນທີ່ຈະສົ່ງກັບໄປທີ່ Center Service
        delete dataFromCenterServiceCreate[0]['secretword'];

        const dataToCreateSignInHistory = {
            db_type,
            store_code: 'user_signin_history',
            set: {
                user_id: parseInt(dataFromCenterServiceCreate[0]['user_id'])
            }
        };

        const dataUserSignInHistory = await StoreService(dataToCreateSignInHistory, 'create');
        console.log('AuthSignUpService (dataUserSignInHistory) : ', dataUserSignInHistory);

        const dataToCenterService = {
            response: {
                message: "Successfully signed up !!",
                data: dataFromCenterServiceCreate
            },
            status_code: 201
        }

        return dataToCenterService;
    } catch (error: any) {
        console.log('AuthSignUpService (Error):', error);

        if ((error?.table === 'user_privacy' && error?.code === '23505') || (validRequestData.store_code === "user_privacy" && error?.sqlState === '23000')) {
            throw { kind: 'email_already_exist', feature: 'sign-up' };
        }

        throw error;
    }
}