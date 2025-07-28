// src/Helper/Middleware/multerConfig.ts หรือรวมไว้ใน index.ts

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// สร้าง path ไปยังโฟลเดอร์ Images
export const imageStoragePath = path.join(__dirname, '..', 'Storages', 'Images');

export const prefixStorageImagePathURL = '/storages/images';

// ตรวจสอบและสร้างโฟลเดอร์ Images ถ้ายังไม่มี
if (!fs.existsSync(imageStoragePath)) {
    fs.mkdirSync(imageStoragePath, { recursive: true });
}

// ตั้งค่าการเก็บไฟล์ของ multer
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, imageStoragePath); // เก็บไว้ใน Upload/Storages/Images
    },
    filename: function (_req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const filename = `${base}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

export const uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
});
