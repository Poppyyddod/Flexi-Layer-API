import { FetchStoreController } from "./fetch";
import { CreateStoreController } from "./create";
import { EditStoreController } from "./edit";
import { RemoveStoreController } from "./remove";
import { ControllerMethodsModel } from "../../models/store.controller.model";

/**
 * @StoreControllerMethods
 * ສຳຫຼັບການເອີ້ນໃຊ້ Controller ຂອງ Feature ນັ້ນໆ
 */

export const StoreControllerMethods: ControllerMethodsModel = {
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
        return RemoveStoreController(helpers);
    }
};