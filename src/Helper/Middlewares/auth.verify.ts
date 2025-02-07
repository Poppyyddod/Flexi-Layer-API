import jwt from 'jsonwebtoken';

export const JwtVerifyToken = async (req: any, res: any, next: any) => {
    try {
        console.log('> JwtCompareToken : ');

        const useAuthToken = false;

        if (!useAuthToken) {
            return next();
        }

        const token = req.headers['x_z_token'];
        console.log('JwtCompareToken (token) : ', token);

        if (!token) {
            return res.status(400).json({
                message: 'No token provided!',
                read_me: {
                    case_1: 'Please check the `key` and `value` in the request headers.',
                    case_2: 'Please provide the token in request headers for authentication.'
                }
            });
        }

        const decoded = jwt.verify(token, `${process.env.SECRET_KEY}`);
        console.log('JwtCompareToken (decoded) : ', decoded);

        req.user = decoded;
        next();
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNCIsImlhdCI6MTczODU4ODQ1NH0.zpWFTx-YBYmstXCoLNJP0suATgYdOwPxx7xZhLFJ6J0
    } catch (error: any) {
        console.log('JwtCompareToken (Error):', error);
        return res.status(400).json({
            message: 'Invalid token',
            read_me: 'Please provide the correct token.'
        });
        // throw error;
    }
}