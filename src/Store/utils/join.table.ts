import { GetCachedTableStructure } from "@SRC/Helper/Cache";
import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { Request, Response } from "express";





/**
 * Validates the structure and logic of each join object in the join list.
 * Ensures all referenced tables and fields exist in the cached table structure,
 * and that at least one side of the ON clause relates to the join target table.
 *
 * @param joinList - The list of join objects received from the client request
 * @param tableStructure - Cached metadata containing available tables and fields
 * @throws {kind: 'invalid_store_code_join'} If any referenced table is missing
 * @throws {kind: 'invalid_field_name_join'} If any referenced field is missing
 * @throws {kind: 'invalid_join_relation'} If neither side of ON references the join table
 */
const validateJoinStructure = (
    joinList: any[],
    tableStructure: Record<string, { field: string }[]>
): void => {
    for (const join of joinList) {
        const joinTable = join.table;
        const onClause = join.on as Record<string, string>;

        if (!tableStructure[joinTable]) {
            throw {
                kind: 'invalid_store_code_join',
                detail: `Join table "${joinTable}" not found.`
            };
        }

        for (const [left, right] of Object.entries(onClause)) {
            const [leftTable, leftField] = left.split(".");
            const [rightTable, rightField] = right.split(".");

            const allTablesExist = tableStructure[leftTable] && tableStructure[rightTable];

            if (!allTablesExist) {
                throw {
                    kind: 'invalid_store_code_join',
                    detail: `Table "${leftTable}" or "${rightTable}" not found.`
                };
            }

            const isLeftValid = tableStructure[leftTable].some(f => f.field === leftField);

            if (!isLeftValid) {
                throw {
                    kind: 'invalid_field_name_join',
                    detail: `Invalid field "${leftField}" in "${leftTable}" at join[${joinList.indexOf(join)}].`
                };
            }

            const isRightValid = tableStructure[rightTable].some(f => f.field === rightField);

            if (!isRightValid) {
                throw {
                    kind: 'invalid_field_name_join',
                    detail: `Invalid field "${rightField}" in "${rightTable}" at join[${joinList.indexOf(join)}].`
                };
            }

            if (leftTable !== joinTable && rightTable !== joinTable) {
                throw {
                    kind: 'invalid_join_relation',
                    detail: `Neither side of ON clause refers to the join table "${joinTable}".`
                };
            }
        }
    }
};







/**
 * Validates the fields provided in the WHERE clause of the request.
 *
 * @param where - Key-value object representing conditions in WHERE clause
 * @param tableStructure - Cached metadata of table structure
 * @throws {kind: 'invalid_store_code_join'} If a referenced table doesn't exist
 * @throws {kind: 'invalid_field_name_join'} If a referenced field doesn't exist
 */
const validateWhereFields = (
    where: Record<string, any>,
    tableStructure: Record<string, { field: string }[]>
): void => {
    for (const key of Object.keys(where)) {
        const [table, field] = key.split(".");

        if (!tableStructure[table]) {
            throw {
                kind: 'invalid_store_code_join',
                detail: `Table "${table}" not found at where key!`
            };
        }

        const isFieldExist = tableStructure[table].some(f => f.field === field);

        if (!isFieldExist) {
            throw {
                kind: 'invalid_field_name_join',
                detail: `Field "${field}" not found in table "${table} at where key!"`
            };
        }
    }
};








/**
 * Validates the format of each join object in the request.
 * Ensures only allowed keys are present and all values are of correct type.
 *
 * @param joinList - Array of join objects from request
 * @throws {kind: 'invalid_join_format'} If format or types are invalid
 */
const validateJoinFormat = (joinList: any[]): void => {
    const allowedJoinKeys = ['table', 'type', 'on'];

    for (const [index, joinObj] of joinList.entries()) {
        const keys = Object.keys(joinObj);

        for (const key of keys) {
            if (!allowedJoinKeys.includes(key)) {
                throw {
                    kind: 'invalid_join_format',
                    detail: `Unexpected key "${key}" found in join[${index}]. Allowed keys are ${allowedJoinKeys.join(', ')}.`
                };
            }
        }

        if (typeof joinObj.table !== 'string') {
            throw {
                kind: 'invalid_join_format',
                detail: `join[${index}].table must be a string.`
            };
        }

        if (typeof joinObj.type !== 'string') {
            throw {
                kind: 'invalid_join_format',
                detail: `join[${index}].type must be a string.`
            };
        }

        if (typeof joinObj.on !== 'object' || Array.isArray(joinObj.on)) {
            throw {
                kind: 'invalid_join_format',
                detail: `join[${index}].on must be an object.`
            };
        }
    }
};








/** Allowed SQL join types */
export const allowedJoinType = ["left", "inner", "right", "full"];

/**
 * Validates the join types provided in the request (e.g., left, inner, etc.)
 *
 * @param req - Express request object
 * @param res - Express response object
 * @throws {kind: 'invalid_join_type'} If join type is not supported
 */
const validateJoinTypes = (req: Request, res: Response): void => {
    const joins = req.body.join;

    if (!joins || !Array.isArray(joins)) return;

    for (const join of joins) {
        const joinType = (join.type || "").toLowerCase();

        if (!allowedJoinType.includes(joinType)) {
            throw { kind: 'invalid_join_type' };
        }
    }
};






/**
 * Main function to validate a join-enabled fetch request.
 * Ensures join structure, types, and WHERE fields are all valid.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @throws Various validation errors depending on what's invalid
 */
export const CheckJoinFeature = (req: Request, res: Response): void => {
    try {
        const joinList = req.body.join;
        const cachedTableStructure = GetCachedTableStructure();

        validateJoinFormat(joinList);
        validateJoinStructure(joinList, cachedTableStructure);

        if (req.body.where) {
            validateWhereFields(req.body.where, cachedTableStructure);
        }

        validateJoinTypes(req, res);

        console.log("✅ Join structure is valid.");
    } catch (error: any) {
        console.error("Error in CheckJoinFeature:", error);
        throw error;
    }
};





/**
 * Converts validated join structure into a SQL JOIN clause string.
 *
 * @param validRequestData - Validated request data containing join array
 * @returns A string of SQL JOIN clauses (e.g., LEFT JOIN table ON condition)
 * @throws If formatting fails
 */
export const FixJoinFormatRequest = (validRequestData: IMyRequestData): string => {
    try {
        const joins = validRequestData.join;

        if (!joins || !Array.isArray(joins)) {
            console.log("❌ [FixJoinFormatRequest] Invalid join structure.");
            return "";
        }

        const joinClauses: string[] = [];

        for (const join of joins) {
            const type = join.type?.toUpperCase() ?? "INNER";
            const table = join.table;
            const onClause = join.on as Record<string, string>;

            const onConditions = Object.entries(onClause).map(
                ([left, right]) => `${left} = ${right}`
            );

            const fullJoin = `${type} JOIN ${table} ON ${onConditions.join(" AND ")}`;
            joinClauses.push(fullJoin);
        }

        const sqlJoins = joinClauses.join(" ");

        console.log("✅ SQL Join Result:", sqlJoins);
        return sqlJoins;
    } catch (error) {
        console.error("FixJoinFormat Error:", error);
        throw error;
    }
};
