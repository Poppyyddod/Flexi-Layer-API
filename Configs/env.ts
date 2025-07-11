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
        SECRET_KEY: process.env.SECRET_KEY!,
        REFRESH_KEY: process.env.REFRESH_KEY!,
        DISCORD_CHANNEL_NEW_CLIENT: process.env.DISCORD_CHANNEL_NEW_CLIENT!,
        DISCORD_CHANNEL_NEW_ORDER: process.env.DISCORD_CHANNEL_NEW_ORDER!,
        DISCORD_CHANNEL_STATUS_CHANGED: process.env.DISCORD_CHANNEL_STATUS_CHANGED!,
        DISCORD_CHANNEL_DISPUTE_RAISED: process.env.DISCORD_CHANNEL_DISPUTE_RAISED!,
        DISCORD_CHANNEL_SERVER_ERROR: process.env.DISCORD_CHANNEL_SERVER_ERROR!,
    };
}
