import { JwtVerifyToken } from '@Helper/Middlewares';
import StoreControllerCenter from '@Store/controllers';
import { Router } from 'express';

/**
 * @function storeRoutes - ສຳຫຼັບການກຳໜົດ Route ຂອງ Store
 * @param app - express router
 * @returns express || route
 */

const storeRoutes = (app: Router) => {
    // console.log('Store routes');

    app.post('/store/fetch', JwtVerifyToken, StoreControllerCenter);
    app.post('/store/create', JwtVerifyToken, StoreControllerCenter);
    app.post('/store/edit', JwtVerifyToken, StoreControllerCenter);
    app.post('/store/delete', JwtVerifyToken, StoreControllerCenter);

    return app;
}

export default storeRoutes;