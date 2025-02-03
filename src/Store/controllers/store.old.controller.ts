import errorHandles from '@Helper/Data/Error';
import logger from '@Helper/Logger';

import {
    FetchStoreService,
    CreateStoreService,
    EditStoreService,
    RemoveStoreService
} from '@Store/services/store.old.service';

export const FetchStoreController = async (req: any, res: any) => {
    try {
        const { set, where, store_code } = req.body;

        if (set) {
            logger('Store', 'warn', {
                message: `Set key object is not required for fetch !!`,
                feature: 'fetch'
            })

            console.warn('\x1b[33m[WARNING] : `set` key object is not required for fetch !!\x1b[0m');
        }

        if (!store_code) {
            throw { kind: 'incomplete_request' };
        }

        const response = await FetchStoreService(req.body);
        console.log('FetchStoreController', response);

        logger('Store', 'info', {
            message: `Got ${where ? 'some' : 'all'} data : '${store_code}'`,
            store: store_code,
            feature: 'fetch'
        });

        return res.status(200).json({
            message: `Got ${where ? 'some' : 'all'} data!!`,
            data: response
        })
    } catch (error) {
        console.log('FetchStoreController (Error):', error);
        const theError = { ...(typeof error === 'object' ? error : {}), functionName: 'Fetch store data' };

        return await errorHandles(theError, res, {
            systemName: 'Store',
            feature: 'fetch'
        });
    }
}


export const CreateStoreController = async (req: any, res: any) => {
    try {
        const { set, where, store_code } = req.body;

        if (where) {
            logger('Store', 'warn', {
                message: '`where` key object is not required for fetch !!',
                store: store_code,
                feature: 'fetch'
            });

            console.warn('\x1b[33m [WARNING] : Where key object is not required for create !!\x1b[0m');
        }

        if (!store_code || !set)
            throw { kind: 'incomplete_request' };

        const response = await CreateStoreService(req.body);
        console.log('CreateStoreController', response);

        logger('Store', 'info', {
            message: `Created data : ${response[0].id}`,
            store: store_code,
            feature: 'create'
        });

        return res.status(201).json({
            message: `Created a new data : ${response[0].id}`,
            store: store_code,
            data: response
        });
    } catch (error) {
        console.log('CreateStoreController (Error):', error);

        const theError = { ...(typeof error === 'object' ? error : {}), functionName: 'Create store data' };

        return await errorHandles(theError, res, {
            systemName: 'Store',
            feature: 'create'
        });
    }
}


export const EditStoreController = async (req: any, res: any) => {
    try {
        const { set, where, store_code } = req.body;

        if (!set || !where || !store_code) {
            throw { kind: 'incomplete_request' };
        }

        const response = await EditStoreService(req.body);
        console.log('EditStoreController', response);

        logger('Store', 'info', {
            message: `Successfully edited whose data matched the query !!`,
            store: store_code,
            feature: 'edit',
            affectedRows: response.affectedRows
        });

        return res.status(200).json({
            message: `Successfully edited whose data mathched the query : '${store_code}'`,
            query: req.body,
            affectedRows: response.affectedRows
        });
    } catch (error) {
        console.log('EditStoreController (Error):', error);
        const theError = { ...(typeof error === 'object' ? error : {}), functionName: 'Edit store data' };

        return await errorHandles(theError, res, {
            systemName: 'Store',
            feature: 'edit'
        });
    }
}


export const RemoveStoreController = async (req: any, res: any) => {
    try {
        const { set, where, store_code } = req.body;

        if (set) {
            logger('Store', 'warn', {
                message: '`set` key object is not required for fetch !!',
                store: store_code,
                feature: 'remove'
            });

            console.warn('[WARNING] : Set key object is not required for create !!');
        }

        if (!where || !store_code)
            throw { kind: 'incomplete_request' };

        const response = await RemoveStoreService(req.body);
        console.log('RemoveStoreController : ', response);

        logger('Store', 'info', {
            message: `Removed whose data matched the query : '${store_code}'`,
            store: store_code,
            feature: 'remove'
        });

        return res.status(200).json({
            message: `Successfully removed whose data mathched the query : '${response.store}'`,
            query: req.body,
            affectedRows: response.affectedRows
        })
    } catch (error) {
        console.log('RemoveStoreController (Error):', error);
        const theError = { ...(typeof error === 'object' ? error : {}), functionName: 'Remove store data' };

        return await errorHandles(theError, res, {
            systemName: 'Store',
            feature: 'remove'
        });
    }
}