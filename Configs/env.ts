import dotenv from "dotenv";
import path from "path";

export function loadEnvConfig() {
    const nodeEnv = process.env.NODE_ENV || "development";
    const envFile =
        nodeEnv === "production" ? ".env.production" :
            nodeEnv === "development" ? ".env.development" : ".env";

    dotenv.config({ path: path.resolve(process.cwd(), envFile) });

    return {
        NODE_ENV: nodeEnv,
        HTTP_PORT: Number(process.env.HTTP_PORT || 5000),
        HTTPS_PORT: Number(process.env.HTTPS_PORT || 5001),
        HOST: process.env.HOST || "localhost",
        MYSQL_USER: process.env.MYSQL_USER!,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD!,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE!,
        MYSQL_STORE_MAPPING: process.env.MYSQL_STORE_MAPPING || "",
        SECRET_KEY: process.env.SECRET_KEY!,
        REFRESH_KEY: process.env.REFRESH_KEY!,
    };
}
