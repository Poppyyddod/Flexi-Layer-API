import { AuthSignInSuccessResponseHttp, AuthSignOutSuccessResponseHttp, AuthSignUpSuccessResponseHttp, CreateSuccessDataResponseHttp } from '@Testing/tester.model';
import { TestAuthRoute, request, server } from '@Testing/tester.config';
import { CacheInitMySqlTableStructure, isCacheReady } from '@SRC/Helper/Cache';
import { CloseHttpsServer } from '@SRC/Helper/Middlewares/runner.https';
import { sql } from '@Configs/Database';
import { isObject } from '@SRC/Helper/Utils';

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
const feature = 'sign-out';

describe(`Test ${dbBrand}/Auth/${feature}`, () => {
    it("should return `Successfully signed out !!` message & data(object) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "user_auth",
            where: {
                user_id: 64 // <- Change it first
            }
        };

        const response = await request(server).post(TestAuthRoute[feature]).send(bodyData);
        const result: AuthSignOutSuccessResponseHttp = response.body;

        expect(response.status).toBe(200);
        expect(result.message).toBe("Successfully signed out !!");
        expect(isObject(result.data)).toBe(true);
        expect(result.data.affectedRows).toBe(1);
    });
});