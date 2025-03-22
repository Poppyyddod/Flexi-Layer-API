/**
 * Start Header
 */

import type { CreateSuccessDataResponseHttp, FetchSuccessDataResponseHttp } from '@SRC/Testing/tester.model';
import { TestStoreRoute, server, request } from '@Testing/tester.config';

const tester = describe;
const feature = 'fetch';
const dbBrand = 'mysql';

/**
 * End Header
 */

let originalLog: any;

beforeAll(async () => {
    originalLog = console.log;
    console.log = jest.fn(); // ปิด console.log

    if (server) {
        await server.close();
    } else {
        await server.connect();
    }
});

/**
 * @Fetch `all row` & `all column` + limit(1)
 */
tester("> Test MySQL/Store/Fetch + all row + all column + limit", () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            store_code: "testing_table",
            field_list: "*",
            where: "*",
            "limit": 1
        };

        const response: any = await request(server).post(TestStoreRoute[feature])
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
tester("> Test MySQL/Store/Fetch + some row + some column + limit", () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            field_list: ["test_id", "string_field"],
            store_code: "testing_table",
            where: {
                test_id: 69
            },
            limit: 1
        };

        const response: any = await request(server).post(TestStoreRoute[feature])
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



/**
 * @Fetch the last row & some column + limit(1)
 */

tester(`> Test MySQL/Store/Fetch + the last row + some column + limit`, () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            field_list: ["test_id", "number_field"],
            store_code: "testing_table",
            where: "test_id:LAST",
            limit: 1,
        };

        const response: any = await request(server).post(TestStoreRoute[feature])
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
tester("> Test MySQL/Store/Fetch + some row + some column + limit", () => {
    it("should return success message & data(array) & status code is 200", async () => {
        const bodyData = {
            db_type: dbBrand,
            field_list: ["test_id", "string_field"],
            store_code: "testing_table",
            where: {
                test_id: [69],
                number_field: 2
            },
            limit: 1
        };

        const response: any = await request(server).post(TestStoreRoute[feature])
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