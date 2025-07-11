
import { Request, Response } from "express";
import { CreateStoreController, EditStoreController, FetchStoreController, DeleteStoreController } from "./features";
import { IStoreReturnToControllerCenter } from "../models/store.controller.model";

export type StoreControllerEndpoint =
    '/store/create' |
    '/store/fetch' |
    '/store/edit' |
    '/store/delete';

type StoreControllerFactory = (helpers: any) => (req: Request, res: Response) => Promise<IStoreReturnToControllerCenter>;

type StoreControllerMethodsModel = {
    [key in StoreControllerEndpoint]: StoreControllerFactory;
};

export const StoreControllerMethods: StoreControllerMethodsModel = {
    '/store/fetch': (helpers) => {
        return FetchStoreController(helpers);
    },

    '/store/create': (helpers) => {
        return CreateStoreController(helpers);
    },

    '/store/edit': (helpers) => {
        return EditStoreController(helpers);
    },

    '/store/delete': (helpers) => {
        return DeleteStoreController(helpers);
    }
};