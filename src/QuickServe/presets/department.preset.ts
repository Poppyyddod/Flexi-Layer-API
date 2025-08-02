import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { isString } from "@SRC/Helper/Utils";

/**
 * Generates a request preset to fetch a single department by its ID.
 *
 * - Converts string ID to number if necessary.
 * - Returns a preset to query the `departments` table filtering by `department_id`.
 *
 * @param {number | string} departmentId - The ID of the department to retrieve.
 * @returns {IMyRequestData} - A query preset for fetching one specific department.
 */
export const getOneDepartmentRequestPreset = (departmentId: number | string): IMyRequestData => {
    if (isString(departmentId)) {
        departmentId = parseInt(departmentId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "departments",
        field_list: "*",
        where: {
            department_id: departmentId
        }
    };

    return preset;
};

/**
 * Generates a request preset to fetch all departments.
 *
 * - Returns a preset to query all records from the `departments` table.
 *
 * @returns {IMyRequestData} - A query preset for fetching all departments.
 */
export const getAllDepartmentRequestPreset = (): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "departments",
        field_list: "*"
    };

    return preset;
};


import { AddDepartmentType } from "@SRC/QuickServe/models/department.model";

export const createDepartmentRequestPreset = (bodyData: AddDepartmentType): IMyRequestData => {
    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "departments",
        set: bodyData
    };

    return preset;
}


import { UpdateDepartmentType } from "@SRC/QuickServe/models/department.model";

export const updateDepartmentRequestPreset = (departmentId: number | string, bodyData: UpdateDepartmentType): IMyRequestData => {
    if (isString(departmentId))
        departmentId = parseInt(departmentId);

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "departments",
        where: {
            department_id: departmentId
        },
        set: bodyData
    };

    return preset;
}





export const deleteOneDepartmentRequestPreset = (departmentId: string | number): IMyRequestData => {
    if (isString(departmentId)) {
        departmentId = parseInt(departmentId);
    }

    const preset: IMyRequestData = {
        db_type: "mysql",
        store_code: "departments",
        where: {
            department_id: departmentId
        }
    };

    return preset;
};
