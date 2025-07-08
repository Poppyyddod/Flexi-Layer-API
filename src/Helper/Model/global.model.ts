export interface IMyRequestData {
    db_type: "mysql" | "postgresql",
    store_code: string,
    where?: any,
    set?: any
}

// export interface IMyDotEnvKey {
//     NODE_ENV: string
//     SERVER_PORT: number
//     HOST: string
//     MYSQL_USER: string
//     MYSQL_PASSWORD: string
//     MYSQL_DATABASE: string
//     MYSQL_STORE_MAPPING: string
//     SECRET_KEY: string
//     REFRESH_KEY: string
// }