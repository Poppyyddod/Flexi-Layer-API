
/**
 * @function AuthSignOutService
 * @param helpers Object / ເປັນທີ່ເກັບ Helper Function ໄວ້ພາຍໃນ
 * @param validRequestData Object / ເປັນ Request Body ທີ່ຖືກຕ້ອງຕາມກຳໜົດແລ້ວ
 * @param feature String / ສຳຫຼັບບົງບອກຄຸນສົມບັດຂອງການບໍລິການ
 * @returns Object
 */

import { isString } from "@Helper/Utils";

/**
 * @function StoreService
 * ສຳຫຼັບການເອີ້ນໃຊ້ Store System ເພື່ອສົ່ງ Request ໄປດືງຂໍ້ມູນຕາມຄຳຂໍ
 */

/**
 * @function ArgonComparePassword
 * ສຳຫຼັບການກວດສອບ Hashed `Secretword` ຫຼື `Password` ແລ້ວກັບທີ່ສົ່ງມາກວດສອບ
 */

export const AuthSignOutService = (helpers: any) => async (httpResponse: any, validRequestData: any, feature: string) => {
    try {
        console.log('AuthSignOutService :', validRequestData);

        const { StoreService } = helpers;

        const { db_type, store_code, where } = validRequestData;
        const { user_id } = where;

        validRequestData['set'] = {
            already_signed_in: false,
            last_online_at: new Date()
        }

        validRequestData['where'] = {
            user_id: user_id
        }

        if (isString(user_id)) {
            validRequestData['where']['user_id'] = parseInt(user_id);
        }

        const dataFromServiceCenter = await StoreService(validRequestData, 'edit');
        console.log('AuthSignOutService (dataFromCenterService) : ', dataFromServiceCenter);

        // await SetCookieForJwtToken(httpResponse, generatedToken);

        const dataToAuthServiceCenter = {
            response: {
                message: "Successfully signed out !!",
                query: validRequestData,
                affectedRows: dataFromServiceCenter.affectedRows,
            },
            status_code: 200
        }

        return dataToAuthServiceCenter;
    } catch (error) {
        console.log('AuthSignOutService (Error):', error);
        throw error;
    }
}