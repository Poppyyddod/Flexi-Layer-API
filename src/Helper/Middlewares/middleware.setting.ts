interface IServerSettings {
    /**
     *  @description
     *  Use `JwtVerifyToken` middleware to verify authentication.
     *  
     *  @listens
     *  Recommended:
     *  For security
     *  
     *  @cahce req.user
     *  @key useAuthToken
     *  @default true
     */
    useAuthToken: boolean; // <- about `JwtVerifyToken`, `tokenKeys`, `useCheckTokenPlaceholder`



    /**
     *  @description
     *  Use it check to resolve placeholder keys from jwt token.
     *  
     *  @description
     *  Example : "user_id": "{{userId}}" -> "user_id": "123"
     *  
     *  Use it to combo:
     *  @function $SettingFunctions.ResolveRequestPlaceholdersUsingToken()
     *  
     *  @default string[]
     */
    tokenKeys: string[]; // <- about `useCheckTokenPlaceholder`

    /**
     *  @overload +1
     *  @description
     *  
     *  Use it to check & resolve placeholder keys from jwt token.
     *  Example : You can send request : "user_id": "{{userId}}"
     *  
     *  Use it to combo:
     *  @interface $Settings.tokenKeys
     *  @function $SettingFunctions.ResolveRequestPlaceholdersUsingToken()
     *  
     *  @listens Recommended:
     *  Large Project -> Use it ||
     *  Small Project -> Do not need
     *  
     *  @key useCheckTokenPlaceholder
     *  (For system need more flexible)
     *  @default true
     */
    useCheckTokenPlaceholder: boolean; // <- about `tokenKeys`
}

/**
 * @description
 * This module consolidates all system setting for easy import elsewhere.
 *  Any variable has $ prefix, it has about system setting.
 *  $SettingFunctions is an object containing all the system setting.
 */
export const $Settings: IServerSettings = {
    useAuthToken: true,
    tokenKeys: ["userId"],
    useCheckTokenPlaceholder: false,
}