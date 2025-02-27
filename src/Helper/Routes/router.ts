import { Router } from 'express';
import storeRoute from 'src/Store/routes/store.route';
import authRoutes from 'src/Auth/routes/auth.route';

/**
 * @function MainRoutes - ສຳຫຼັບການເກັບ Route ແຕ່ລະ System ເພື່ອໄປໃຊ້ໃນ Main index ອີກເທື່ອຫນື່ງ (Cleaner code)
 * @param app - Express Router
 * @returns 
 */

const GuiderRoutes = (app: Router) => {
    storeRoute(app);
    authRoutes(app);

    return app;
}

export default GuiderRoutes;
