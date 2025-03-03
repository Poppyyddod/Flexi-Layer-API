import dotenv from 'dotenv';
dotenv.config();
const ENV = process.env as any;

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