import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";

/**
 * Generates a request preset to fetch a single position by its ID.
 *
 * - Converts string ID to integer if necessary.
 * - Returns a structured query object for the `positions` table with a `where` condition.
 *
 * @param {number | string} positionId - The ID of the position to retrieve.
 * @returns {IMyRequestData} - A query preset for fetching one specific position.
 */
export const getOnePositionRequestPreset = (positionId: number | string): IMyRequestData => {
    if (isString(positionId)) {
        positionId = parseInt(positionId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "positions",
        field_list: "*",
        where: {
            position_id: positionId
        }
    };

    return preset;
};

/**
 * Generates a request preset to fetch all positions.
 *
 * - Returns a structured query object for the `positions` table without any filters.
 *
 * @returns {IMyRequestData} - A query preset for fetching all position records.
 */
export const getAllPositionsRequestPreset = (): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "positions",
        field_list: "*"
    };

    return preset;
};





import { AddPositionType } from "@SRC/QuickServe/models/position.model";

export const createPositionRequestPreset = (bodyData: AddPositionType): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "positions",
        set: bodyData
    };

    return preset;
}


import { UpdatePositionType } from "@SRC/QuickServe/models/position.model";

export const updatePositionRequestPreset = (posId: number | string, bodyData: UpdatePositionType): IMyRequestData => {
    if (isString(posId))
        posId = parseInt(posId);

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "positions",
        where: {
            position_id: posId
        },
        set: bodyData
    };

    return preset;
}





export const deleteOnePositionRequestPreset = (positionId: string | number): IMyRequestData => {
    if (isString(positionId)) {
        positionId = parseInt(positionId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "positions",
        where: {
            position_id: positionId
        }
    };

    return preset;
};