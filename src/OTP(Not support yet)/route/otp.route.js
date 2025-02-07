module.exports = app => {
    const otpController = require('../controller/otp.controller');

    app.post('/otp/receive', otpController.receiveOtpController);
    app.post('/otp/generate', otpController.generateOtpController);

    return app;
}