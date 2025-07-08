import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import server from 'src/index';
import { sql } from '@Configs/Database';

const mysql = sql;

beforeAll(async () => {
    // เชื่อมต่อฐานข้อมูลที่นี่
    if (!mysql) {
        await mysql.getConnection()
            .then(() => console.log('* MySQL connected successfully!'))
            .catch((error: any) => console.error('* (Error): MySQL connection failed:', error));
    }

    // if (!pgsql) {
    //     await pgsql.connect()
    //         .then(() => console.log('* PostgreSQL connected successfully!'))
    //         .catch((error: any) => console.error('* (Error): PostgreSQL connection error', error));
    // }
});

afterAll(async () => {
    if (server) {
        server.close();
        console.log('## Server connection closed.');
    }

    if (mysql) {
        await mysql.end();
    }

    // if (pgsql) {
    //     await pgsql.end();
    // }
});

const flexLayerApiVersion = 'v1';

export const TestStoreRoute: any = {
    fetch: `/${flexLayerApiVersion}/store/fetch`,
    create: `/${flexLayerApiVersion}/store/create`,
    edit: `/${flexLayerApiVersion}/store/edit`,
    delete: `/${flexLayerApiVersion}/store/delete`
}

export const TestAuthRoute: any = {
    'sign-up': `/${flexLayerApiVersion}/auth/sign-up`,
    'sign-in': `/${flexLayerApiVersion}/auth/sign-in`,
    'sign-out': `/${flexLayerApiVersion}/auth/sign-out`
}

export {
    server,
    request
};