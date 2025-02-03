
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from '@Helper/Utils';
import {
    CreateAuthRespo,
    CheckAuthRespo,
} from '../respositories';
import { SQLmanagement } from '@Helper/Query/SQL';
import { ExpireCaculator } from '@Helper/Utils';


export const CreateAuthService = async (request: any) => {
    try {
        console.log('CreateAuthService (Request) : ', request);

        const { secret_key } = request;
        const hashedPassword = await hashPassword(secret_key);

        request['secret_key'] = hashedPassword;
        console.log('CreateAuthService (hashedPassword) : ', request);

        const response = await CreateAuthRespo(request);
        console.log('CreateAuthService (response) : ', response);

        const accessToken = await generateAccessToken(response.id);
        console.log('CheckAuthService (generatedAccessToken) : ', accessToken);

        const refreshToken = await generateRefreshToken(response.id);
        console.log('CheckAuthService (generatedRefreshToken) : ', refreshToken);

        delete response['secret_key'];

        const dataToClient = {
            auth_data: response,
            access_token: {
                key: accessToken.token,
                expire_time: accessToken.expire_time,
            },
            refresh_token: {
                key: refreshToken.token,
                expire_time: refreshToken.expire_time
            }
        }

        return dataToClient;
    } catch (error: any) {
        console.log('CreateAuthService (error) : ', error);

        if (error.code === 'ER_DUP_ENTRY') {
            throw { kind: 'name_exist' };
        }

        throw error;
    }
}



export const CheckAuthService = async (request: any) => {
    try {
        console.log('CheckAuthService (Request) : ', request);

        const response = await CheckAuthRespo(request);
        console.log('CheckAuthService (response) : ', response);

        if (response.length === 0) return false;

        console.log('CheckAuthService (response) : ', response[0].secret_key);
        console.log('CheckAuthService (request) : ', request.secret_key);

        const isCorrectKey = await comparePassword(request.secret_key, response[0].secret_key);
        console.log('CheckAuthService (isCorrectKey) : ', isCorrectKey);

        if (!isCorrectKey) {
            throw { kind: 'incorrect_key' };
        }

        const accessToken = await generateAccessToken(response.id);
        console.log('CheckAuthService (generatedAccessToken) : ', accessToken);

        const refreshToken = await generateRefreshToken(response.id);
        console.log('CheckAuthService (generatedRefreshToken) : ', refreshToken);

        delete response[0]['secret_key'];

        const dataToClient = {
            data: {
                auth_data: response[0],
                access_token: {
                    key: accessToken.token,
                    expire_time: accessToken.expire_time,
                },
                refresh_token: {
                    key: refreshToken.token,
                    expire_time: refreshToken.expire_time
                }
            }
        }

        await AddRefreshToken(dataToClient.data);

        return dataToClient;
    } catch (error) {
        console.log('CheckAuthService (error) : ', error);
        throw error;
    }
}


export const AddRefreshToken = async (data: any) => {
    try {
        console.log('AddRefreshToken : ', data);

        const { auth_data, refresh_token, db_type } = data;

        const cmd = `
            INSERT INTO refresh_token (token, user_id, expired_at)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            expired_at = VALUES(expired_at), 
            token = VALUES(token)
        `;

        const expireDate = ExpireCaculator(refresh_token.expire_time);

        const params = [
            refresh_token.key,
            auth_data.id,
            expireDate
        ];

        console.log('AddRefreshToken (params) : ', params);

        const response = await SQLmanagement(db_type, { cmd, params, isReturn: true });
        console.log('AddRefreshToken (response) : ', response);

        // return response || [];
        return true;
    } catch (error) {
        console.log('AddRefreshToken (error) : ', error);
        throw error;
    }
}