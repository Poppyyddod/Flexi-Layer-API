import dotenv from 'dotenv';
dotenv.config();
const ENV = process.env as any;

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import exp from 'constants';





/**
 * @function convertToJson - String to JSON
 * @param string 
 * @returns 
 */

export const convertStringToJson = async (string: string) => {
    try {
        const jsonObject = Object.fromEntries(
            [...string.matchAll(/#(\w+[^:]*):([^,']+)/g)].map(match => [match[1], match[2]])
        );

        return jsonObject;
    } catch (error: any) {
        console.log('StoreMapping (error: any):', error);
        throw error;
    }
}


/**
 * 
 * @param {*} password - Request password ຮັບມາຈາກ Sign Up Service
 * @throws - Hashed Code
 */

export const hashPassword = async (password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('wdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa : ', hashedPassword);
        return hashedPassword;
    } catch (error: any) {
        throw error;
    }
}


/**
 * 
 * @param {*} password - Request password
 * @param {*} hashedPassword - MySQL Data password (hashed password)
 * @returns - Boolean
 */

export const comparePassword = async (password: string, hashedPassword: string) => {
    const isCorrected = await bcrypt.compare(password, hashedPassword);
    return isCorrected;
}


/**
 * ສຳຫຼັບການສ້າງ Access Token
 * @param {*} userId - ໄອດີຜູ້ໃຊ້
 * @throws - Token || Null(error: any)
 */

export const generateAccessToken = async (userId: any) => {
    try {
        const expireTime = 60 * 60; // 1 hour in seconds

        const accessToken = jwt.sign({ userId }, ENV.SECRET_KEY, { expiresIn: '1h' });
        return { token: accessToken, expire_time: expireTime };
    } catch (error: any) {
        console.log('generateToken (utils) : ', error.message);
        throw error;
    }
};
/**
 * ສຳຫຼັບການສ້າງ Refresh Token
 * @param {*} userId - ໄອດີຜູ້ໃຊ້
 * @throws - Token || Null(error: any)
 */

export const generateRefreshToken = async (userId: any) => {
    try {
        const expireTime = 24 * 60 * 60; // 1 hour in milliseconds
        const refreshToken = jwt.sign({ userId }, ENV.REFRESH_KEY, { expiresIn: '1d' });
        // console.log(refreshToken);

        return { token: refreshToken, expire_time: expireTime };
    } catch (error: any) {
        console.log('generateToken (utils) : ', error.message);
        // return null;
        throw error;
    }
}

/**
 * ສຳຫຼັບການ Verify Token
 * @param {*} token
 * @throws - Token || Null(error: any)
 */

export const verifyToken = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers['x_z_token'] || req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, ENV.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error: any) {
        console.log('verifyToken (utils) : ', error.message);
        return res.status(401).json({ message: 'Failed to authenticate token' });
        // throw error;
    }
};



export const ExpireCaculator = (expireTime: number) => {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expireTime * 1000);
    console.log("Expiration Date:", expirationDate);

    return expirationDate;
}