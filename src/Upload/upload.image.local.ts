import errorHandles from "@SRC/Helper/Data/Error";
import { Request, Response } from "express";
import { prefixStorageImagePathURL } from "./utils/upload.utils";
import Logger from "@SRC/Helper/Logger/logger";


interface IUploadImageWithLocal {
    message: string;
    success: boolean;
    data: {
        name: string;
        path: string;
    };
}




/**
 * Handles uploading a single image file to local storage.
 *
 * This function is designed to work with `multer.single('image')`.
 * It expects an image file in the request and returns the file name and relative path
 * where the image is stored (with prefix from `prefixStorageImagePathURL`).
 *
 * @function UploadImageWithLocal
 * @async
 * @param {Request} req - Express request object. Must contain `req.file` from multer.
 * @param {Response} res - Express response object used to send back result.
 *
 * @returns {Promise<void>} - Responds with JSON data about uploaded image or an error response.
 *
 * @example
 * // Successful response structure:
 * {
 *   message: 'Successfully uploaded image!',
 *   success: true,
 *   data: {
 *     name: 'example-1690000000000.jpg',
 *     path: '/images/example-1690000000000.jpg'
 *   }
 * }
 *
 * @remarks
 * If the image is not present in the request, it will respond with status 400.
 * All errors are handled via `errorHandles` helper.
 */

export const UploadImageWithLocal = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No image file uploaded',
                success: false
            });
        }

        const relativePath = `${prefixStorageImagePathURL}/${req.file.filename}`;

        const dataToReturn: IUploadImageWithLocal = {
            message: 'Successfully uploaded image!',
            success: true,
            data: {
                name: req.file.filename,
                path: relativePath
            }
        };

        Logger("Upload", "info", dataToReturn);

        res.json({
            message: dataToReturn.message,
            success: dataToReturn.success,
            data: dataToReturn.data
        });
    } catch (error) {
        console.log('UploadImageWithLocal (Error) : ', error);

        return res.status(500).json({
            success: false,
            message: 'Unexpected error occurred during image upload',
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        // await errorHandles(error, res, {
        //     systemName: 'Upload',
        //     feature: 'upload-local-image'
        // });
    }
}
