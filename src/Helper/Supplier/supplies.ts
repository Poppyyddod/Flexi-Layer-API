import { stores } from "./stores";

/**
 * @function Supplier - ເຮັດມາເພື່ອປ່ຽນແປງຂໍ້ມູນ Request ທີ່ສຳຄັນພາຍໃນ Server ເພື່ອຄວາມປອດໄພ
 * @param data - Valid Request Data Structure
 * @returns {Object}
 * @throws {Error}
 */

/**
 * 
 * @stores
 * ແມ່ນ ຕົວປ່ຽນທີ່ເກັບ Methods ສຳຫຼັບການປ່ຽນຂໍ້ມູນ
 * ສົ່ງຄືນຄ່າເປັນ Key Object (store, set, where)
 */

const Supplier = async (data: any) => {
    try {
        console.log('> Supplier :');
        console.log('- Data : ', data);

        const { db_type, store, feature, where, set } = data;

        if (!stores[store] || !stores[store][feature]) {
            console.log('* Supplier (Error) ?: ', `Not found or it doesn't exist the supplier method!! : '${store}' => '${feature}'`);
            return data;
        }

        const response = await stores[store][feature]({ set, where });
        console.log('- Supplier (Response) : ', response);

        return { db_type, store, ...response };
    } catch (error) {
        console.log('Supplier (Error) : ', error);
        throw error;
    }
};

export default Supplier;
