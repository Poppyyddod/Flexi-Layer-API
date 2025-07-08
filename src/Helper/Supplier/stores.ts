import { GenerateBillNumber } from './functions';
// import { hashPassword } from '@Helper/Utils';

/**
 * @MethodsModel
 * ເປັນ Model ສຳຫຼັບ Parameter ທີ່ຈະສົ່ງມາ
 */

interface MethodsModel {
    [key: string]: {
        [method: string]: (data: any) => Promise<any>;
    };
}


/**
 * @stores
 * ສຳຫຼັບການເກັບ Method Object (Supplier Structure)
 */

/**
 * @EveryMethod
 * ຈະສົ່ງຄືນຄ່າເປັນ Key Object ແລະ ຂໍ້ມູນຈະຕ້ອງມີ (store, set, where) ເທົ່ານັ້ນ
 */

/**
 * ການປ່ຽນຂໍ້ມູນໃຫ້ກັບ Key ນັ້ນໆແມ່ນຕົວຢ່າງ :
 * data['set'].bill_name = `Bill#${billNumber}`;
 */

// Store Supplier
export const stores: MethodsModel = {
    'bills': {
        'create': async (data: any) => {
            const { set, where } = data;
            console.log('Supplier (bills)(Create) : ', set, where);

            if (set.bill_name.length > 0) {
                return data;
            }

            const billNumber = await GenerateBillNumber();
            // console.log('Bill Number : ', billNumber);
            data['set'].bill_name = `Bill#${billNumber}`;

            return data;
        }
    },

    // 'auths': {
    //     'create': async (data: any) => {
    //         try {
    //             console.log('* Auths-create : ', data);

    //             const { password } = data;

    //             const hashedPassword = await hashPassword(password);
    //             console.log('Auths-create (hashedPassword) : ', hashedPassword);

    //             data['set'].password = hashedPassword;

    //             return data;
    //         } catch (error) {
    //             console.log('Auths-create method : ', error);
    //             throw error;
    //         }
    //     },
    // }
};