import { Router } from 'express';

import { JwtVerifyToken } from '@Helper/Middlewares';
import { UploadImageWithLocal } from '../upload.image.local';
import { uploadImage } from '../utils/upload.utils';


const uploadRoutes = (router: Router) => {
    // console.log('Upload routes');

    router.post('/upload/image/local', JwtVerifyToken, uploadImage.single('image'), UploadImageWithLocal);

    return router;
}

export default uploadRoutes;