const exporter = module.exports;
const crypto = require('crypto');
const nodemailer = require('nodemailer');



/**
 * @function generateOTP - ສຳຫຼັບການສ້າງ OTP ໃໝ່
 */

exporter.generateOTP = async () => {
    try {
        // const format = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const format = '0123456789';
        let otp = '';

        // Generate OTP of the specified length
        for (let i = 0; i < 6; i++) {
            const randomIndex = crypto.randomInt(0, format.length);
            otp += format[randomIndex];
        }

        console.log('gerateOTP : ', otp);
        return otp;
    } catch (err) {
        console.log(err);
        throw err;
    }
}




/**
 * @function sendEmail - ສຳຫຼັບການສົ່ງ Email
 * @param {*} email - String
 * @param {*} otp - String
 */

exporter.sendEmail = async (email, otp) => {
    try {
        console.log(`send to : ${email}`);
        // sent gmail to user

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nohff1234@gmail.com',
                pass: 'tabeoejjpgbakujh'
            }
        });

        const otpParam = otp;
        const emailParam = email;

        const mailOptions = {
            from: '"POPPY" <nohff1234@gmail.com>',
            to: `${emailParam}, ${emailParam}`,
            subject: 'TEST OTP SYSTEM',
            text: `Hello OTP!!`,
            html: `
                <h1>OTP Verification</h1>
                <u><strong id="otp">${otpParam}</strong></u>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.log('sendEmail : ', err);
        throw err;
    }
}