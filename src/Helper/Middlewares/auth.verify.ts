import jwt from 'jsonwebtoken';
import { $Settings } from './middleware.setting';

export const JwtVerifyToken = async (req: any, res: any, next: any) => {
    try {
        console.log('> JwtCompareToken : ');

        if (!$Settings.useAuthToken) {
            return next();
        }

        // console.log(req.headers['authorization']);

        let token = req.headers['x_z_token'];

        if (!token && req.headers['authorization']) {
            const authHeader = req.headers['authorization'];

            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }

        if (!token) {
            return res.status(400).json({
                message: 'No token provided!',
                read_me: {
                    case_1: 'Please check the `key` and `value` in the request headers.',
                    case_2: 'Provide the token in `x_z_token` or `Authorization: Bearer <token>`'
                }
            });
        }

        const decoded = jwt.verify(token, `${process.env.SECRET_KEY}`);
        console.log('JwtCompareToken (decoded) : ', decoded);

        req.user = decoded;
        next();
    } catch (error: any) {
        console.log('JwtCompareToken (Error):', error);
        return res.status(400).json({
            message: 'Invalid provider token!',
            read_me: 'Please provide the correct token in Authorization header or x_z_token.'
        });
    }
};
