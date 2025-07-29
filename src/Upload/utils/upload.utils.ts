import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Absolute path to the directory for storing uploaded image files.
 * Example: /project-root/src/Storages/Images
 */
export const imageStoragePath = path.join(__dirname, '..', 'Storages', 'Images');

/**
 * Public-facing URL prefix for accessing stored images.
 * Used when returning URLs to the frontend.
 */
export const prefixStorageImagePathURL = '/storages/images';

/**
 * Ensure that the image storage directory exists.
 * If not, it will be created recursively.
 */
if (!fs.existsSync(imageStoragePath)) {
    fs.mkdirSync(imageStoragePath, { recursive: true });
}

/**
 * Multer disk storage configuration for saving uploaded images.
 * Files will be saved in `imageStoragePath` with a timestamped filename.
 */
const storage = multer.diskStorage({
    /**
     * Set the destination folder for uploaded files.
     * @param _req - Express request object (unused).
     * @param _file - The uploaded file.
     * @param cb - Callback to indicate destination path.
     */
    destination: function (_req, _file, cb) {
        cb(null, imageStoragePath);
    },

    /**
     * Generate the filename for the uploaded file.
     * Format: originalName-{timestamp}.{ext}
     * @param _req - Express request object (unused).
     * @param file - The uploaded file.
     * @param cb - Callback to indicate the new filename.
     */
    filename: function (_req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const filename = `${base}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

/**
 * Multer middleware for handling single image uploads.
 * - Accepts only files with fieldname `image`
 * - Only image MIME types are allowed
 * - Max file size: 5MB
 */
export const uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB

    /**
     * Filter the uploaded file.
     * Reject if:
     * - Field name is not 'image'
     * - File MIME type is not an image
     * @param req - Express request object.
     * @param file - The uploaded file.
     * @param cb - Callback to accept or reject the file.
     */
    fileFilter: (req, file, cb) => {
        if (file.fieldname !== 'image') {
            return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
        }

        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }

        cb(null, true);
    }
});
