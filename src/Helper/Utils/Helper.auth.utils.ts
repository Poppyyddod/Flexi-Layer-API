import dotenv from 'dotenv';
dotenv.config();

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { IUserAuthTableField } from '@SRC/Auth/models/auth.sign-in.model';


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
    userAuthData: IUserAuthTableField,
    expireTime: "1h" | "1d" | "7d"
): Promise<string> => {
    try {
        console.log('JwtGenerateToken (parameter) : ', userAuthData);
        const secretKey = process.env.SECRET_KEY;

        const { user_id, user_email, user_name } = userAuthData;

        const token = jwt.sign(
            { user_id, user_email, user_name },
            `${secretKey}`,
            { expiresIn: expireTime }
        );

        console.log('JwtGenerateToken (token) : ', token);

        return token;
    } catch (error) {
        console.error('JwtGenerateToken (Error):', error);
        throw error;
    }
};



export const JwtDecodeToken = async (token: string) => {
    try {
        console.log('JwtDecodeToken (token) : ', token);
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        console.log('JwtDecodeToken (Error):', error);
        throw error;
    }
}