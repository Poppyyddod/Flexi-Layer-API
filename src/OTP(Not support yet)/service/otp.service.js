const exporter = module.exports;
const { DateTime } = require('luxon');

const {
    generateOTP,
    sendEmail
} = require('../utils/index');

const {
    validateEmail
} = require('../../Auth/validation/index');

const {
    hashPassword,
    comparePassword
} = require('../../Auth/utils/index');

const {
    getTimestamps,
} = require('@Helper/utils/main.utils/index');

const {
    generateOtpRespon,
    receiveOtpRespon
} = require('../responsitory/index');


/**
 * @function generateOtpService - ສຳຫຼັບການເລີ່ມຂະບວນການສ້າງລະຫັດ OTP
 * @param {*} email 
 * @returns {Key Object}
 * @throws {Error}
 */

/**
 * 
 * @function validateEmail
 * ສຳຫຼັບການກວດສອບຄວາມຖືກຕ້ອງຂອງ Email
 */

/**
 * 
 * @function generateOTP
 * ສຳຫຼັບການສ້າງ Token ໃໝ່
 */

/**
 * 
 * @function hashPassword
 * ສຳຫຼັບການປອມແປງ OTP
 */

/**
 * 
 * @function getTimestamps
 * ສຳຫຼັບການຮັບເອົາ ວັນເວລາລ່າສຸດ (ເວລາໝົດອາຍຸ)
 */

/**
 * 
 * @function generateOtpRespon
 * ສຳຫຼັບການບັນທຶກຂໍ້ມູນ ແລະ ລະຫັດ OTP ລົງໃນ Database
 */

/**
 * 
 * @function sendEmail
 * ສຳຫຼັບການສົ່ງລະຫັດ OTP ໃຫ້ກັບ Email ນັ້ນໆ
 */


exporter.generateOtpService = async (email) => {
    try {
        const validEmail = validateEmail(email);
        // console.log('generateOtpService (validateEmail): ', validEmail);

        if (validEmail?.kind) {
            throw validEmail;
        }

        // ສ້າງ OTP
        const otp = await generateOTP();
        // console.log('generateOtpService (generateCode): ', otp);

        const hashedOtp = await hashPassword(otp);
        // console.log('generateOtpService (hashPassword): ', hashedOtp);

        const expireTime = 120; // 120 seconds
        const timestamps = getTimestamps(expireTime);
        // console.log('generateOtpService (getTimestamps): ', timestamps);

        const { create_at, expired_at } = timestamps;

        const dataToRecord = {
            email,
            otp: hashedOtp,
            create_at,
            expired_at
        };

        const record = await generateOtpRespon(dataToRecord);
        // console.log('generateOtpService (generateOtpRespon): ', record);

        // console.log('generateOtpService (sendEmail): ', otp);
        const isSendedEmail = await sendEmail(email, otp);
        // console.log('generateOtpService (sendEmail): ', isSendedEmail);

        if (isSendedEmail) {
            throw { kind: 'cannot_send_email' };
        }

        delete record['id'];
        record['otp'] = otp;
        return record;
    } catch (err) {
        if (err.code) {
            throw { kind: err.code };
        }

        console.log('generateOtpService (Error): ', err);
        throw err;
    }
}







/**
 * @function receiveOtpService - ສຳຫຼັບການເລີ່ມຂະບວນການກວດສອບລະຫັດ OTP
 * @param {*} email
 * @returns {Key Object}
 * @throws {Error}
 */

/**
 * 
 * @function validateEmail
 * ສຳຫຼັບການກວດສອບຄວາມຖືກຕ້ອງຂອງ Email
 */

/**
 * 
 * @function receiveOtpRespon
 * ສຳຫຼັບການເລີ່ມຂະບວນການດືງເອົາຂໍ້ມູນ
 */

/**
 * 
 * @function comparePassword
 * ສຳຫຼັບການກວດສອບລະຫັດ OTP ວ່າຖືກຕ້ອງຕາມຂໍ້ມູນທີ່ດືງມາຈາກ Database ຫຼື ບໍ
 */

exporter.receiveOtpService = async (email, otp) => {
    try {
        // console.log('receiveOtpService : ', email, otp);
        const validEmail = validateEmail(email);
        // console.log('generateOtpService (validateEmail): ', validEmail);

        if (validEmail?.kind) {
            throw validEmail;
        }

        const response = await receiveOtpRespon(email);
        // console.log('receiveOtpService (receiveOtpRespon) : ', response);

        if (response.kind === 'no_row') {
            throw { kind: 'no_row' };
        }

        const isCorrect = await comparePassword(otp, response.otp);
        // console.log('receiveOtpService (comparePassword) : ', isCorrect);

        const { expired_at } = response;
        const timeZone = 'Asia/Vientiane';
        const dateTimeNow = DateTime.now().setZone(timeZone);
        // console.log('receiveOtpService (Date time now) : ', dateTimeNow);

        if (dateTimeNow > expired_at) {
            throw { kind: 'expired_otp' };
        }

        return isCorrect;
    } catch (err) {
        if (err.code) {
            throw { kind: err.code };
        }

        console.log('receiveOtpService (Error): ', err);
        throw err;
    }
}