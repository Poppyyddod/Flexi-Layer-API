import { sendDiscordWebhook } from "@SRC/Helper/Supplier";
import { serverError } from "../lists/list.server.error";
import { loadEnvConfig } from "@Configs/env";

const RAW_ENV = loadEnvConfig();


/**
 * @function ServerSideError - ສຳຫຼັບການກວດສອບ Server error
 * @param Logger - Helper function
 * @param err - Error details
 * @param res - Response HTTP
 * @param system - Object
 * @returns Response HTTP
 * @throws {Error}
 */

/**
 * 
 * @function Logger
 * ເອີ້ນໃຊ້ຈາກ Helper/Logger ສຳຫຼັບການບັນທຶກເຫດການຕ່າງໆທີ່ເກີດຂື້ນໃນ Server ລົງໃນ logs
 */

/**
 * 
 * @serverError 
 * ເປັນ Key object ທີ່ເກັບລາຍລະອຽດຂອງ Server error ແລະ HTTP Status
 */

const ServerSideError = (Logger: any) => async (err: any, res: any, system: any) => {
    try {
        console.log('* Server side check error type worked');
        const { systemName, feature } = system;
        // console.log('Server error: ', err);
        const hasServerError = serverError[err.kind];

        // Check if headers are already sent to avoid sending a response again
        if (res.headersSent) {
            console.log('Headers already sent, avoiding duplicate response.');
            return;
        }

        if (!hasServerError) {
            const errorData = {
                message: err.message,
                system: systemName,
                feature: feature,
                status: 500
            };

            Logger('Store', 'error', errorData);

            if (RAW_ENV.NODE_ENV === 'production')
                await sendDiscordWebhook('error', JSON.stringify({err, system}));

            return res.status(500).json({
                message: `Some error (${err.functionName})`,
            });
        }

        const { more, code } = hasServerError;

        Logger('Store', 'error', {
            more,
            system: systemName,
            feature: feature,
            status: code
        });

        if (RAW_ENV.NODE_ENV === 'production')
            await sendDiscordWebhook('error', JSON.stringify(hasServerError));

        console.log('Server error: ', hasServerError);
        return res.status(code).json(more);
    } catch (error) {
        console.log('ServerSideError (Error) : ', error);
        throw error;
    }
}

export default ServerSideError;