interface IServerSettings {
    useAuthToken: boolean;

    tokenKeys: string[];
    useCheckTokenPlaceholder: boolean;
}

/**
 * @description
 * This module consolidates all system setting for easy import elsewhere.
 *  Any variable has $ prefix, it has about system setting.
 *  $SettingFunctions is an object containing all the system setting.
 */
export const $Settings: IServerSettings = {
    /**
     *  @description
     *  Use `JwtVerifyToken` middleware to verify authentication.
     *  
     *  Recommended:
     *  For security
     *  
     *  @key useAuthToken
     *  @default true
     */
    useAuthToken: false,


    /**
     *  @description
     *  Use `CheckMyIdFromJwtToken` middleware to check user id from jwt token.
     *  You can send request : "user_id": "{{user.id}}"
     *  # For system need more flexible `CheckMyIdFromJwtToken`
     *  
     *  Recommended:
     *  Large Project -> Use it
     *  Small Project -> Do not need
     *  
     *  @key useCheckTokenUserId
     *  @default true
     */
    tokenKeys: ["userId"],
    useCheckTokenPlaceholder: false,
}