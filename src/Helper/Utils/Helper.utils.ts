import dotenv from 'dotenv';
dotenv.config();
const ENV = process.env as any;

import jwt from 'jsonwebtoken';
import exp from 'constants';



export const ToMySQLDateTime = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

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