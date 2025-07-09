import { Router } from 'express';
import storeRoute from '@SRC/Store/routes/store.route';
import authRoutes from '@SRC/Auth/routes/auth.route';
import { CacheInitMySqlTableStructure, isCacheReady } from '../Cache';

/**
 * @function MainRoutes - ສຳຫຼັບການເກັບ Route ແຕ່ລະ System ເພື່ອໄປໃຊ້ໃນ Main index ອີກເທື່ອຫນື່ງ (Cleaner code)
 * @param app - Express Router
 * @returns 
 */

let alreadyInit = false;

const Init = async () => {
    if (!isCacheReady() && !alreadyInit) {
        console.warn("⚠️ Cache not ready — running lazy init...");
        await CacheInitMySqlTableStructure();
        alreadyInit = true;
    }
}

const GuiderRoutes = async (app: Router) => {
    await Init();

    storeRoute(app);
    authRoutes(app);

    return app;
}

export default GuiderRoutes;
