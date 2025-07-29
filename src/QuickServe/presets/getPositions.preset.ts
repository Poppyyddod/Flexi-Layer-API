import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";


export const getOnePositionRequestPreset = (positionId: number | string) => {

    if (isString(positionId)) {
        positionId = parseInt(positionId);
    }

    const preset: IMyRequestData = {
        "db_type": "mysql",
        "store_code": "positions",
        "field_list": "*",
        "where": {
            "position_id": positionId
        }
    }

    return preset;
}

export const getAllPositionsRequestPreset = () => {
    const preset: IMyRequestData = {
        "db_type": "mysql",
        "store_code": "positions",
        "field_list": "*"
    }

    return preset;
}