import dotenv from 'dotenv';
import winston from 'winston';
import systemPath from './logger.system.paths';
import { recordLevel, LogLevel } from './logger.level';
dotenv.config();

/**
 * @function Logger - ສຳຫຼັບບັນທຶກທຸກເຫດການທີ່ເກີດຂື້ນກັບ Server
 * @param system 
 * @param level 
 * @param message 
 */

/**
 * 
 * @function systemPath
 * ສຳຫຼັບການນຳເອົາ Path ຈາກລະບົບຕ່າງໆມາລະບຸໃຫ້ກັບ Winston(Logger)
 * ຄືນຄ່າເປັນ Object ທີ່ມີ Key : errorLog, combinedLog - ເປັນ Path
 */

/**
 * 
 * @function recordLevel
 * ສຳຫຼັບການສົ່ງຂໍ້ມູນໄປບັນທຶກດ້ວຍ Level ຂອງ Log ໃນແຕ່ລະເຫດການ
 */

const Logger = async (system: string, level: LogLevel, more: any) => {
    try {
        const env = process.env.NODE_ENV;
        // console.log(env);

        const paths = systemPath(system);
        // console.log(paths);

        const winstonLogger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                winston.format.json()
            ),
            transports: [
                new winston.transports.File({ filename: paths?.errorLog, level: 'error' }),
                new winston.transports.File({ filename: paths?.warnLog, level: 'warn' }),
                new winston.transports.File({ filename: paths?.combinedLog })
            ]
        });

        await recordLevel(winstonLogger, level, more);

        // if (env === 'production') {
        //     await recordLevel(winstonLogger, level, more);
        //     // console.log(`* A new logged in : (${system} system)`);
        // }
    } catch (err) {
        console.log('Logger (winstion) : ', err);
        throw err;
    }
}

export default Logger;