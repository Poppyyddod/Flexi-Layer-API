import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from 'src/index'; // เปลี่ยนจาก index → app
import { sql } from '@Configs/Database';
import { IStoreFeatureList } from '@SRC/Store/models/store.global.model';

const mysql = sql;

beforeAll(async () => {
    const conn = await mysql.getConnection();
    await conn.ping();
    conn.release();
    console.log('[TEST DB] MySQL connected!');
});

afterAll(async () => {
    await mysql.end();
    console.log('[TEST DB] MySQL pool closed.');
});

const apiVersion = 'v1';

export const TestStoreRoute: any = {
    fetch: `/${apiVersion}/store/fetch`,
    create: `/${apiVersion}/store/create`,
    edit: `/${apiVersion}/store/edit`,
    delete: `/${apiVersion}/store/delete`
};

export const TestAuthRoute: any = {
    "sign-up": `/${apiVersion}/auth/sign-up`,
    "sign-in": `/${apiVersion}/auth/sign-in`,
    "refresh-token": `/${apiVersion}/auth/refresh-token`,
    "sign-out": `/${apiVersion}/auth/sign-out`
};

export {
    request,
    app as server
};
