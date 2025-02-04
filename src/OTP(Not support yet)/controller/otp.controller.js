const exporter = module.exports;

const {
    generateOtpService,
    receiveOtpService
} = require('../service/otp.service');

const errorHandles = require('@errorHandles');
const logger = require('@Helper/utils/logger/index');


/**
 * @function generateOtpController - ສ້າງລະຫັດ OTP
 * @param {*} req - HTTP Request
 * @param {*} res - HTTP Response
 * @returns - HTTP Response
 */

/**
 * Request Body :
 * email: String
 */

/**
 * @function generateOtpService
 * ສຳຫຼັບການເລີ່ມຂະບວນການສ້າງລະຫັດ OTP ໃໝ່
 */

/**
 * 
 * @function logger
 * ເອີ້ນໃຊ້ຈາກ Main Utils/logger ສຳຫຼັບການບັນທຶກເຫດການຕ່າງໆທີ່ເກີດຂື້ນໃນ Server ລົງໃນ logs
 */

/**
 * @function errorHandles
 * ເອີ້ນໃຊ້ຈາກ Main Utils/error ສຳຫຼັບການກວດສອບປະເພດຂອງ Error ເພື່ອ Response ໄປທາງ HTTP
 * ບໍ່ສົ່ງຄ່າກັບຄືນ
 */

exporter.generateOtpController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw { kind: 'ER_BAD_FIELD_ERROR' };
        }

        const response = await generateOtpService(email);
        // console.log('generateOtpController : ', response);

        logger('otp', 'info', 'Generated OTP number!!');
        return res.status(201).json({
            data: response,
            message: `Generated OTP number!!`
        });
    } catch (err) {
        console.log('generateOtpController (error): ', err);
        return await errorHandles({ ...err, functionName: 'Generate OTP' }, res, 'otp');
    }
}





/**
 * @function receiveOtpController - ສົ່ງລະຫັດ OTP ເພືອກວດສອບ
 * @param {*} req - HTTP Request
 * @param {*} res - HTTP Response
 * @returns {Key Object} - ຂໍ້ມູນຂອງລະຫັດ OTP ນັ້ນໆ
 */

/**
 * Request Body :
 * email: String
 * otp: String
 */

/**
 * 
 * @function receiveOtpService
 * ສຳຫຼັບການເລີ່ມຂະບວນການກວດສອບ Email ແລະ ລະຫັດ OTP
 */

/**
 * @function logger
 * ສຳຫຼັບການບັນທຶກເຫດການຕ່າງໆທີ່ເກີດຂື້ນໃນ Server ລົງໃນ logs
 */

/**
 * @function errorHandles
 * ເອີ້ນໃຊ້ຈາກ Main Utils/error ສຳຫຼັບການກວດສອບປະເພດຂອງ Error ເພື່ອ Response ໄປທາງ HTTP
 */

exporter.receiveOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // // console.log('receiveOTP : ', email, otp);

        if (!email || !otp) {
            throw { kind: 'ER_BAD_FIELD_ERROR' };
        }

        const response = await receiveOtpService(email, otp);
        // console.log('receiveOtpController : ', response);

        if (!response) {
            logger('otp', 'error', 'Incorrect OTP!!');
            return res.status(400).json({ message: "Incorrect OTP!!" });
        }

        logger('otp', 'info', 'The OTP is correct!');
        return res.status(201).json({ message: "The OTP is correct!" });
    } catch (err) {
        console.log('receiveOtpController (error): ', err);
        return await errorHandles({ ...err, functionName: 'Receive OTP' }, res, 'otp');
    }
}