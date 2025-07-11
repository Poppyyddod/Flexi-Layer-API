import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

export const rateLimiter = (maxReq: number, windowMs: number) => {
    return rateLimit({
        windowMs,
        max: maxReq,
        message: {
            kind: 'too_many_requests',
            message: 'Too many requests, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req: Request, res: Response, next: NextFunction, options) => {
            // สามารถจัดการเองได้ ถ้าอยาก log หรือทำ custom response
            return res.status(options.statusCode).json(options.message);
        }
    });
};
