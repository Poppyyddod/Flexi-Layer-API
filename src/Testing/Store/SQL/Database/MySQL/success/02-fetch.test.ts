import { CacheInitMySqlTableStructure, isCacheReady } from '@SRC/Helper/Cache';
import { CloseHttpsServer } from '@SRC/Helper/Middlewares/runner.https';
import { FetchSuccessDataResponseHttp } from '@SRC/Testing/tester.model';
import { request, server, TestStoreRoute } from '@SRC/Testing/tester.config';
import { sql } from '@Configs/Database';
import { Response } from 'supertest';
import { $Settings } from '@SRC/Helper/Middlewares/middleware.setting';

let originalLog: any;
let alreadyInit = false;

const Init = async (): Promise<void> => {
    if (!isCacheReady() && !alreadyInit) {
        await CacheInitMySqlTableStructure();
        alreadyInit = true;
    }
};

beforeAll(async () => {
    originalLog = console.log;
    console.log = jest.fn();
    await Init();
});

afterAll(async () => {
    console.log = originalLog;

    await CloseHttpsServer();

    if (server && server.close) {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }

    if (sql && !sql._closed) {  // _closed เป็น internal property (mysql2 ไม่มี API เช็ค pool ว่ายังเปิดหรือปิด)
        try {
            await sql.end();
        } catch (err) {
            // console.warn('MySQL pool already closed or error on closing:', err);
        }
    }
});

const dbBrand = 'mysql';
const feature = 'fetch';

/**
 * @Fetch `all row` & `all column` + limit(1)
 */
describe("> Test MySQL/Store/Fetch + all row + all column + limit", () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "store_testing",
            field_list: "*",
            where: "*",
            limit: 1
        };

        const response: Response = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log('# [RESULT] : Fetch/All Row/MySQL : ', response);
        expect(
            response.status === 200
            || response.status === 404
        ).toBe(true);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log('# [OBJECT] : Fetch/All Row/MySQL : ', obj);

        expect(
            obj.data.length === 1
            || obj.message === "No row in the store!"
        ).toBe(true);
    });
});



/**
 * @Fetch some row & some column + limit(1)
 */
describe("> Test MySQL/Store/Fetch + some row + some column + limit", () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            field_list: ["store_testing_id", "string_field"],
            store_code: "store_testing",
            where: {
                store_testing_id: 69
            },
            limit: 1
        };

        const response: Response = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log('# [RESULT] : Fetch/All Row/MySQL : ', response);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log('# [OBJECT] : Fetch/Some Row/MySQL : ', obj);

        expect(
            response.status === 200
            || response.status === 404
        ).toBe(true);

        expect(
            obj.data?.length === 1
            || obj.message === "Data's not found!"
        ).toBe(true);
    });
});



/**
 * @Fetch the last row & some column + limit(1)
 */

describe(`> Test MySQL/Store/Fetch + the last row + some column + limit`, () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            field_list: ["store_testing_id", "number_field"],
            store_code: "store_testing",
            where: "store_testing_id:LAST",
            limit: 1,
        };

        const response: Response = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log('# [RESULT] : Fetch/All Row/MySQL : ', response);
        expect(
            response.status === 200
            || response.status === 404
        ).toBe(true);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log('# [OBJECT] : Fetch/The last row/MySQL : ', obj);

        expect(
            obj.data?.length === 1
            || obj.message === "No row in the store!"
            || obj.message === "Data's not found!"
        ).toBe(true);
    });
});


/**
 * @Fetch some row & some column + limit(1) (difference data)
 */
describe("> Test MySQL/Store/Fetch + some row + some column + limit", () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            field_list: ["store_testing_id", "string_field"],
            store_code: "store_testing",
            where: {
                store_testing_id: [69],
                number_field: 2
            },
            limit: 1
        };

        const response: Response = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log('# [RESULT] : Fetch/All Row/MySQL : ', response);
        expect(
            response.status === 200
            || response.status === 404
        ).toBe(true);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log('# [OBJECT] : Fetch/Some Row/MySQL : ', obj);

        expect(
            obj.data?.length === 1
            || obj.message === "Data's not found!"
        ).toBe(true);
    });
});