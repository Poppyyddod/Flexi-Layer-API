import { CacheInitMySqlTableStructure, isCacheReady } from '@SRC/Helper/Cache';
import { CloseHttpsServer } from '@SRC/Helper/Middlewares/runner.https';
import { EditSuccessDataResponseHttp, FetchSuccessDataResponseHttp } from '@SRC/Testing/tester.model';
import { request, server, TestStoreRoute } from '@SRC/Testing/tester.config';
import { Response } from 'supertest';
import { sql } from '@Configs/Database';

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
const feature = 'delete';

/**
 * @Delete same as column data in one request
 */
describe(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Same) should return & affectedRow > 0 & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "store_testing",
            where: {
                number_field: 1
            }
        }

        const response: Response = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${feature} : `, response);
        expect(
            response.status === 200 
            || response.status === 404
        ).toBe(true);

        const obj: EditSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(
            obj.affectedRows > 0 
            || obj.message === "Data's not found!"
        ).toBe(true);
    });
});


/**
 * @Delete not same column data in one request
 */
describe(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Not Same) should return & affectedRow > 0 & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "store_testing",
            where: {
                string_field: ["Success testing", "Success testing Many 1", "Success testing Many 2"]
            }
        }

        const response: Response = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${feature} : `, response);
        expect(
            response.status === 200 
            || response.status === 404
        ).toBe(true);

        const obj: EditSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(
            obj.affectedRows > 0 
            || obj.message === "Data's not found!"
        ).toBe(true);
    });
});