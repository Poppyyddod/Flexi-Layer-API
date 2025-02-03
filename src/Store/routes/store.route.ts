import storeController from '@Store/controllers';
import { Router } from 'express';

/**
 * @function routes - ສຳຫຼັບການກຳໜົດ Route ຂອງ Store
 * @param app - express
 * @returns express || route
 */

const storeRoutes = (app: Router) => {
    // console.log('Store routes');

    app.post('/store/fetch', storeController);
    app.post('/store/create', storeController);
    app.patch('/store/edit', storeController);
    app.delete('/store/delete', storeController);

    return app;
}

export default storeRoutes;