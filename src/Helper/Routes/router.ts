import { Router } from 'express';
import storeRoute from 'src/Store/routes/store.route';
import authRoutes from 'src/Auth/routes/auth.route';

/**
 * @function routes - ສຳຫຼັບການເກັບ Route ແຕ່ລະ System ເພື່ອໄປໃຊ້ໃນ Main index ອີກເທື່ອຫນື່ງ (Cleaner code)
 * @param app - Express Router
 * @returns 
 */

const routes = (app: Router) => {
    storeRoute(app);
    authRoutes(app);

    return app;
}

export default routes;
