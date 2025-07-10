import { CreateSuccessDataResponseHttp } from '@Testing/tester.model';
import { TestStoreRoute, request, server } from '@Testing/tester.config';
import { format } from 'date-fns';
import { CacheInitMySqlTableStructure, isCacheReady } from '@SRC/Helper/Cache';
import { CloseHttpsServer } from '@SRC/Helper/Middlewares/runner.https';
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
const feature = 'create';

describe(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(One) should return success message & data(array) & status code is 201", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "store_testing",
            set: {
                string_field: `Success testing`,
                number_field: 1,
                timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                boolean_field: 1
            }
        };

        const response = await request(server).post(TestStoreRoute[feature]).send(bodyData);

        expect(response.status).toBe(201);

        const result: CreateSuccessDataResponseHttp = response.body;

        expect(result.message).toBe("New data from the request successfully created!");
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBe(1);
    });
});

/**
 * @Create many row in one query test
 */

describe(`Test ${dbBrand}/Store/${feature}`, () => {
    it("(Many) should return success message & data(array) & status code is 201", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "store_testing",
            set: [
                {
                    string_field: `Success testing Many 1`,
                    number_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: 1
                },
                {
                    string_field: `Success testing Many 2`,
                    number_field: 1,
                    timestamp_field: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    boolean_field: 1
                }
            ]
        }

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : Store/${dbBrand}/${${feature} : `, response);
        expect(response.status).toBe(201);

        const obj: CreateSuccessDataResponseHttp = await response.body;
        // console.log(`# [OBJECT] : Store/${dbBrand}/${feature} : `, obj);

        expect(
            obj.data.length >= 1
        ).toBe(true);
    });
});