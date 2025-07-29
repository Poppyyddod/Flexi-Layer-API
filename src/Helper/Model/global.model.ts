export interface IMyRequestData {
    db_type: "mysql"
    store_code: string
    where?: any
    set?: any
    field_list?: string | string[]
    join?: IJoinTableFeature
    limit?: number
}

export interface IJoinTableFeature {
    table: string;
    type: string;
    on: Record<string, string>;
}

export interface IMySQLTableStructure {
    field: string;
    type: string;
    comment: string;
}

export interface IMyTokenData {
    userId: number | string
    expireAt: number
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