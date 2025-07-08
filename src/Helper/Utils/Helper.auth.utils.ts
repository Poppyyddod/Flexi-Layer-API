import dotenv from 'dotenv';
dotenv.config();

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';


/**
 * @function ArgonHashPassword ສຳຫຼັບການ Hash `secretword` ຫຼື `password`
 * @param password
 * @returns 
 */
export const ArgonHashPassword = async (password: string): Promise<string> => {
    try {
        const hashed = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,  // 64MB
            timeCost: 4,
            parallelism: 2
        });
        // console.log('argon2HashPassword (hashed) : ', hashed);

        return hashed;
    } catch (error) {
        console.log('argon2HashPassword (Error):', error);
        throw error;
    }
};


/**
 * @function ArgonComparePassword ສຳຫຼັບການກວດສອບ Hashed `password` ຫຼື ການ Compare
 * @param password 
 * @param hashedPassword 
 * @returns 
 */
export const ArgonComparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const compared = await argon2.verify(hashedPassword, password);
        // console.log('ArgonComparePassword (compared) : ', compared);
        return compared;
    } catch (error) {
        console.log('ArgonComparePassword (Error):', error);
        throw error;
    }
};



/**
 * @function JwtGenerateAccessToken ສຳຫຼັບການສ້າງ Access Token ດ້ວຍ JsonWebToken
 * @param userId 
 * @returns 
 */
export const JwtGenerateToken = async (
    userId: string | number,
    expireTime: "1h" | "1d" | "7d" // เช่น "1h" หรือ 3600
): Promise<string> => {
    try {
        console.log('JwtGenerateToken (parameter) : ', userId);
        const secretKey = process.env.SECRET_KEY;

        const token = jwt.sign({ userId }, `${secretKey}`, { expiresIn: expireTime });
        console.log('JwtGenerateToken (token) : ', token);

        return token;
    } catch (error) {
        console.error('JwtGenerateToken (Error):', error);
        throw error;
    }
};


/**
 * @function JwtGenerateRefreshToken ສຳຫຼັບການສ້າງ Refresh Token ດ້ວຍ JsonWebToken
 * @param userId 
 * @returns 
 */
export const JwtGenerateRefreshToken = async (userId: string | number) => {
    try {
        console.log('JwtGenerateToken (parameter) : ', userId);

        const token = jwt.sign({ userId }, `${process.env.SECRET_KEY}`);
        console.log('JwtGenerateToken (token) : ', token);

        return token;
    } catch (error) {
        console.log('JwtGenerateToken (Error):', error);
        throw error;
    }
}

// export const generateAccessToken = async (userId: any) => {
//     try {
//         const expireTime = 60 * 60; // 1 hour in seconds

//         const accessToken = jwt.sign({ userId }, ENV.SECRET_KEY, { expiresIn: '1h' });
//         return { token: accessToken, expire_time: expireTime };
//     } catch (error: any) {
//         console.log('generateToken (utils) : ', error.message);
//         throw error;
//     }
// };

// export const generateRefreshToken = async (userId: any) => {
//     try {
//         const expireTime = 24 * 60 * 60; // 1 hour in milliseconds
//         const refreshToken = jwt.sign({ userId }, ENV.REFRESH_KEY, { expiresIn: '1d' });
//         // console.log(refreshToken);

//         return { token: refreshToken, expire_time: expireTime };
//     } catch (error: any) {
//         console.log('generateToken (utils) : ', error.message);
//         // return null;
//         throw error;
//     }
// }

// export const ExpireCaculator = (expireTime: number) => {
//     const now = new Date();
//     const expirationDate = new Date(now.getTime() + expireTime * 1000);
//     console.log("Expiration Date:", expirationDate);

//     return expirationDate;
// }

// /**
//  * @function SetCookieForJwtToken ສຳຫຼັບການສ້າງ Cookie ເພື່ອເກັບ Token
//  * @param res 
//  * @param token 
//  */
// export const SetCookieForJwtToken = async (res: any, token: string) => {
//     try {
//         console.log('SetCookieForJwtToken (token) : ', token);

//         const expiryDate = new Date(9999, 0, 1);

//         await res.cookie('jwt_token', token, {
//             httpOnly: true,
//             secure: true,
//             expires: expiryDate,
//         });

//         const cookie = res.getHeaders()['set-cookie'];

//         console.log('SetCookieForJwtToken (cookies): ', cookie);
//     } catch (error) {
//         console.log('SetCookieForJwtToken (Error):', error);
//         throw error;
//     }
// }