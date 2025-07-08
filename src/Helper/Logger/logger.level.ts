/**
 * Log ແຕ່ລະ Level
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';


/**
 * @function recordLevel - ສຳຫຼັບການບັນທຶກເຫດການລົງໃນ Log ຕາມ level
 * @param Logger - winston function
 * @param level - log level (string)
 * @param more - Data to log
 */

export const recordLevel = async (Logger: any, level: LogLevel, more: any) => {
    try {
        if (Logger) {
            Logger[level](more);

            console.log(`* A new logged : `, more);
        }
    } catch (error) {
        console.log('recordLevel (Error):', error);
        throw error;
    }
}