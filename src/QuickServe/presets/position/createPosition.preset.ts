import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { AddPositionType } from "@SRC/QuickServe/models/position.model";

export const createPositionRequestPreset = (bodyData: AddPositionType): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "positions",
        set: bodyData
    };

    return preset;
}