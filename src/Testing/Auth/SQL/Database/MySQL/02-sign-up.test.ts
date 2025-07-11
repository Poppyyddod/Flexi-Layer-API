import { AuthSignInSuccessResponseHttp, AuthSignUpSuccessResponseHttp, CreateSuccessDataResponseHttp } from '@Testing/tester.model';
import { TestAuthRoute, request, server } from '@Testing/tester.config';
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
const feature = 'sign-up';

describe(`Test ${dbBrand}/Auth/${feature}`, () => {
    it("should return `Successfully signed up !!` message & data(array) > 0 & status code is 201", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "user_auth",
            set: {
                user_email: "testing@gmail.com",
                user_name: "Mr testing",
                user_password: "Ez12345!@#"
            }
        };

        const response = await request(server).post(TestAuthRoute[feature]).send(bodyData);
        const result: AuthSignUpSuccessResponseHttp = response.body;

        expect(response.status).toBe(201);
        expect(result.message).toBe("Successfully signed up !!");
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBe(1);
    });
});