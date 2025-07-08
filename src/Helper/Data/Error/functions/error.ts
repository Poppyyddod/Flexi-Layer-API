import Logger from "@Helper/Logger";
import ClientSideError from "./error.client.side";
import ServerSideError from "./error.server.side";
import { Response } from "express";

/**
 * @function checkError - ສຳຫຼັບການກວດສອບວ່າເປັນ Client ຫຼື Server ທີ່ມີ Error
 * @param {*} err - Error
 * @param {*} res - HTTP Response
 * @param {*} system - System name (String)
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
 * @function ClientSideError
 * ສຳຫຼັບການກວດສອບວ່າເປັນ Client Error ຫຼື ບໍ
 * ຄືນຄ່າເປັນ Response HTTP
 */

/**
 * 
 * @function ServerSideError
 * ສຳຫຼັບການກວດສອບວ່າເປັນ Server Error ຫຼື ບໍ
 * ຄືນຄ່າເປັນ Response HTTP
 */

const checkError = async (err: any, res: Response, system: any) => {
    try {
        console.log('checkError : ', err);

        const hasClientError = await ClientSideError(Logger)(err, res, system);
        // console.log('It had client error : ', hasClientError);

        if(hasClientError) return hasClientError;

        const hasServerError = await ServerSideError(Logger)(err, res, system);
        // console.log('It had server error : ', hasServerError);

        if(hasServerError) return hasServerError;

        return res.status(500).json({
            message: `* Not sure about the error(${system})`,
            read_me: 'Please check list mapping error on server side.'
        });
    } catch (catchError) {
        console.log('CheckError (catchError) : ', catchError);
        throw catchError;
    }
};

export default checkError;