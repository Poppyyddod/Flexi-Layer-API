declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string
        HTTP_PORT: number
        HTTPS_PORT: number
        HOST: string
        MYSQL_USER: string
        MYSQL_PASSWORD: string
        MYSQL_DATABASE: string
        MYSQL_STORE_MAPPING: string
        SECRET_KEY: string
        REFRESH_KEY: string
    }
}
