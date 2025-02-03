import dotenv from 'dotenv';
dotenv.config();

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

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


export const JwtGenerateToken = async (userId: string | number) => {
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


export const SetCookieForJwtToken = async (res: any, token: string) => {
    try {
        console.log('SetCookieForJwtToken (token) : ', token);

        const expiryDate = new Date(9999, 0, 1);

        await res.cookie('jwt_token', token, {
            httpOnly: true,
            secure: true,
            expires: expiryDate,
        });

        const cookie = res.getHeaders()['set-cookie'];

        console.log('SetCookieForJwtToken (cookies): ', cookie);
    } catch (error) {
        console.log('SetCookieForJwtToken (Error):', error);
        throw error;
    }
}