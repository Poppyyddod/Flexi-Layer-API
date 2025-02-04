const exporter = module.exports;

const {
    sqlSelector,
    sqlCreator,
    sqlEditor
} = require('@Helper/utils/mysql/index');

/**
 * @function generateOtpRespon - ການສົ່ງຄຳສັ່ງໄປ Query ເພື່ອຈັດການກັບ MySQL
 * @param {*} data - Key Object
 * @returns {Key Object}
 * @throws {Error}
 */

/**
 * 
 * @function sqlSelector
 * ສຳຫຼັບການດືງຂໍ້ມູນ
 */

/**
 * 
 * @function sqlEditor
 * ສຳຫຼັບການ Update ຂໍ້ມູນ
 */

/**
 * 
 * @function sqlCreator
 * ສຳຫຼັບການສ້າງຂໍ້ມູນໃໝ່
 */

exporter.generateOtpRespon = async (data) => {
    try {
        // console.log('generateOtpRespon : ', data);
        const { email, otp, create_at, expired_at } = data;

        const dataToUpdate = {
            otp,
            create_at,
            expired_at
        };

        const selectCMD = 'SELECT id FROM otp WHERE email = ?;';
        const otpData = await sqlSelector(selectCMD, email);
        // console.log('generateOtpRespon (sqlSelector) : ', otpData);

        if (otpData.kind === 'no_row') {
            const insertCMD = 'INSERT INTO otp SET ?';
            const response = await sqlCreator(insertCMD, data);
            // console.log('generateOtpRespon (sqlCreator) : ', response);

            return response;
        } else {
            const updateCMD = 'UPDATE otp SET ? WHERE email = ?;';
            const response = await sqlEditor(updateCMD, dataToUpdate, email);
            // console.log('generateOtpRespon (sqlEditor) : ', response);

            const dataToService = {
                email: email,
                ...response
            }

            return dataToService;
        }
    } catch (err) {
        console.log('generateOtpRespon (error) : ', err);
        throw err;
    }
}

/**
 * @function receiveOtpRespon - ການສົ່ງຄຳສັ່ງໄປ Query ເພື່ອຈັດການກັບ MySQL
 * @param {*} email - Key Object
 * @returns {Key Object}
 * @throws {Error}
 */

/**
 * 
 * @function sqlSelector
 * ສຳຫຼັບການດືງຂໍ້ມູນ
 */

exporter.receiveOtpRespon = async (email) => {
    try {
        // console.log('receiveOtpRespon : ', email);

        const cmd = 'SELECT * FROM otp WHERE email = ?;';
        const response = await sqlSelector(cmd, email);
        // console.log('receiveOtpRespon (sqlSelector) : ', response);

        return response;
    } catch (err) {
        console.log('receiveOtpRespon (error) : ', err);
        throw err;
    }
}