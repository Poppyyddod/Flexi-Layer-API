
import { $Settings } from "../../Middlewares/middleware.setting";
import { IMyTokenData } from "@SRC/Helper/Model/global.model";





/**
 * Replace placeholder values in an object or array with values from decoded JWT token.
 *
 * @param target - The object or array to process.
 * @param decodedTokenData - Decoded token data containing user information.
 * @param parentKey - Key label used for logging context.
 */
const replaceUserIdPlaceholder = (
    target: any,
    decodedTokenData: IMyTokenData,
    parentKey = "unknown"
): void => {
    try {
        if (Array.isArray(target)) {
            target.forEach((item, index) => {
                if (typeof item === "object" && item !== null) {
                    Object.keys(item).forEach((key) => {
                        TryReplace(target, key, decodedTokenData, parentKey);
                    });
                }
            });
        } else if (typeof target === "object" && target !== null) {
            Object.keys(target).forEach((key) => {
                TryReplace(target, key, decodedTokenData, parentKey);
            });
        } else {
            console.log(`⚠️  Skipped - ${parentKey} is not object or array`);
        }
    } catch (error) {
        throw error;
    }
};





/**
 * Resolve a nested value from the token object using dot notation.
 *
 * @param tokenData - The token object.
 * @param path - The dot-notated string path (e.g., 'user.id').
 * @returns The resolved value or undefined if not found.
 */
const ResolveValueFromToken = (tokenData: any, path: string): any => {
    return path.split('.').reduce((acc, curr) => acc?.[curr], tokenData);
};






/**
 * Try to replace a single key in an object with a value from token based on placeholder.
 *
 * @param obj - The object to mutate.
 * @param key - The key to inspect and potentially replace.
 * @param decodedTokenData - Decoded JWT token data.
 * @param label - Label for logging context.
 */
const TryReplace = (obj: any, key: string, decodedTokenData: IMyTokenData, label: string) => {
    const value = obj[key];
    if(typeof value !== "string") return;

    const result = CheckPlaceholderFormat(value);

    if (result === "skip") return;
    if (result === "invalid") throw { kind: "invalid_placeholder_format", feature: "setting function" };
    if (result === "invalid_token_key") throw { kind: "invalid_token_key", feature: "setting function" };

    if (typeof value === "string") {
        if (!$Settings.useAuthToken) throw { kind: "auth_token_setting_turn_off" };

        const tokenKeyValue = ResolveValueFromToken(decodedTokenData, value.slice(2, -2));
        console.log(`🔁 Replaced placeholder in ${label}.${key} with value:`, tokenKeyValue);
        obj[key] = tokenKeyValue;
    }
};





/**
 * Validates the format of a given placeholder string.
 *
 * @param placeholder - The placeholder string to validate.
 * @returns PlaceholderFormatStatus string indicating result of validation.
 */
export const CheckPlaceholderFormat = (placeholder: string): string => {
    const trimmed = placeholder?.trim?.();

    if (!trimmed.includes("{") && !trimmed.includes("}"))
        return "skip";

    if (!trimmed.startsWith("{{") || !trimmed.endsWith("}}"))
        return "invalid";

    const innerPlaceholder = trimmed.slice(2, -2);
    if (!$Settings.tokenKeys.includes(innerPlaceholder))
        return "invalid_token_key";

    return "default";
};





/**
 * Middleware function to resolve all placeholder values in `req.body.where` and `req.body.set`
 * using values from the decoded JWT token.
 *
 * @param req - Express request object containing the user and request body.
 */
const ResolveRequestPlaceholdersUsingToken = async (req: any): Promise<void> => {
    console.log("* Check and modify id value `{{user.id}}`!");

    const decodedTokenData = req.user as IMyTokenData;
    console.log("🔐 Decoded token data: ", decodedTokenData);

    const { where, set } = req.body;

    replaceUserIdPlaceholder(where, decodedTokenData, "where");
    replaceUserIdPlaceholder(set, decodedTokenData, "set");
};

export default ResolveRequestPlaceholdersUsingToken;
