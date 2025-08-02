import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";

/**
 * Generates a request preset to fetch a single employee by their ID.
 *
 * - Converts the employee ID to a number if provided as a string.
 * - Returns a query preset with a `where` clause targeting `emp_id`.
 *
 * @param {string | number} empId - The ID of the employee to retrieve.
 * @returns {IMyRequestData} - A query preset object for fetching one employee.
 */
export const getOneBonusRequestPreset = (empId: string | number): IMyRequestData => {
    if (isString(empId)) {
        empId = parseInt(empId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "bonuses",
        field_list: "*",
        where: {
            emp_id: empId
        }
    };

    return preset;
};

/**
 * Generates a request preset to fetch all bonuses.
 *
 * - Does not include any filter conditions.
 * - Returns all fields from the `bonuses` table.
 *
 * @returns {IMyRequestData} - A query preset object for fetching all bonuses.
 */
export const getAllBonusRequestPreset = (): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "bonuses",
        field_list: "*"
    };

    return preset;
};



import { UpdateBonusType } from "@SRC/QuickServe/models/bonus.model";

export const updateBonusRequestPreset = (bonusId: number | string, bodyData: UpdateBonusType): IMyRequestData => {
    if (isString(bonusId))
        bonusId = parseInt(bonusId);

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "bonuses",
        where: {
            bonus_id: bonusId
        },
        set: bodyData
    };

    return preset;
}



export const deleteOneBonusRequestPreset = (bonusId: string | number): IMyRequestData => {
    if (isString(bonusId)) {
        bonusId = parseInt(bonusId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "bonuses",
        where: {
            bonus_id: bonusId
        }
    };

    return preset;
};
