
import { clientError } from '../lists/list.client.error';



/**
 * @function ClientSideError - ສຳຫຼັບການກວດສອບ Client error
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
 * @clientError 
 * ເປັນ Key object ທີ່ເກັບລາຍລະອຽດຂອງ Client error ແລະ HTTP Status
 */

const ClientSideError = (Logger: any) => async (err: any, res: any, system: any) => {
    try {
        console.log('* Client side check error type worked : ', err);
        const { systemName, feature } = system;
        const hasClientError = clientError[err.kind];

        if (!hasClientError) return null;

        const { more, code } = hasClientError;
        console.log('Client error: ', hasClientError);

        Logger('Store', 'error', {
            more,
            system: systemName,
            feature: feature,
            status: code
        });

        if (!more.allowed) {
            return res.status(code).json({
                ...more
            });
        }

        const errorOn = {
            err,
            systemName,
            db_type: err.db_type,
            feature
        }

        const theAllowed = await more.allowed(errorOn);
        console.log('Allowed', theAllowed);

        const errorDataToClient = {
            ...more,
            system: systemName,
            feature,
            ...theAllowed
        }

        console.log('ClientSideError (errorDataToClient) : ', errorDataToClient);

        return res.status(code).json(errorDataToClient);
    } catch (error) {
        console.log('ClientSideError (Error) : ', error);
        throw error;
    }
}

export default ClientSideError;