import { JwtVerifyToken } from '@Helper/Middlewares';
import storeController from '@Store/controllers';
import { Router } from 'express';

/**
 * @function storeRoutes - ສຳຫຼັບການກຳໜົດ Route ຂອງ Store
 * @param app - express router
 * @returns express || route
 */

const storeRoutes = (app: Router) => {
    // console.log('Store routes');

    app.post('/store/fetch', JwtVerifyToken, storeController);
    app.post('/store/create', JwtVerifyToken, storeController);
    app.patch('/store/edit', JwtVerifyToken, storeController);
    app.delete('/store/delete', JwtVerifyToken, storeController);

    return app;
}

export default storeRoutes;