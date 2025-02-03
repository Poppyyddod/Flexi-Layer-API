/**
 * @function authRoutes - ສຳຫຼັບການກຳໜົດ Route ຂອງ Auth
 * @param app - express
 * @returns express || route
 */

import AuthCenterController from "../controllers/auth.controller";


const authRoutes = (app: any) => {
    const authController = require('../controllers/auth.controller');

    app.post('/auth/sign-up', AuthCenterController);
    app.post('/auth/sign-in', AuthCenterController);
    app.post('/auth/sign-out', AuthCenterController);

    return app;
}

export default authRoutes;