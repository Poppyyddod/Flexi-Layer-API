/**
 * Store Controller Model
 */

export type ControllerMethodMapping = {
    [route: string]: ControllerMethodsModel
}

export type ControllerMethodRouteKeys = '/store/fetch' | '/store/create' | '/store/edit' | '/store/delete';

export type ControllerMethodsModel = {
    [key in ControllerMethodRouteKeys]: (helpers: any) => (req: any, res: any) => Promise<any>
}