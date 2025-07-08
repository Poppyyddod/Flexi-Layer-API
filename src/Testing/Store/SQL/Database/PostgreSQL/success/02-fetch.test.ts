/**
 * Start Header
 */

import type { CreateSuccessDataResponseHttp, FetchSuccessDataResponseHttp } from '@SRC/Testing/tester.model';
import { TestStoreRoute, server, request } from '@Testing/tester.config';

const dbBrand = 'postgresql';
const feature = 'fetch';
const tester = describe;

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

afterAll(() => {
    console.log = originalLog; // คืนค่าฟังก์ชันเดิม
});

/**
 * @Fetch `all row` & `all column` + limit(1)
 */
tester(`> Test ${dbBrand}/Store/${feature} + all row + all column + limit`, () => {
    it("should return data(array) & status code is 200", async () => {
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

        // console.log(`# [RESULT] : ${feature}/All Row/${dbBrand} : `, response);
        expect(response.status).toBe(200);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : ${feature}/All Row/${dbBrand} : `, obj);

        expect(
            obj.data.length > 0
            || obj.message === "No row in the store!"
        ).toBe(true);
    });
});



/**
 * @Fetch some row & some column + limit(1)
 */
tester(`> Test ${dbBrand}/Store/${feature} + some row + some column + limit`, () => {
    let originalLog: any;

    beforeAll(() => {
        originalLog = console.log;
        console.log = jest.fn(); // ปิด console.log
    });

    afterAll(() => {
        console.log = originalLog; // คืนค่าฟังก์ชันเดิม
    });

    it("should return data(array) & status code is 200 or 404", async () => {
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

        // console.log(`# [RESULT] : ${feature}/Some Row/${dbBrand} : `, response);
        expect(
            response.status === 200
            || response.status === 404
        ).toBe(true);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : ${feature}/The some row/${dbBrand} : `, obj);

        expect(
            obj.message === "Data's not found!"
            || obj?.data.length >= 1
        ).toBe(true);
    });
});



/**
 * @Fetch the last row & some column + limit(1)
 */

tester(`> Test ${dbBrand}/Store/${feature} + the last row + some column + limit`, () => {
    it("should return data(array) & status code is 200", async () => {
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

        // console.log(`# [RESULT] : ${feature}/The last row/${dbBrand} : `, response);
        expect(response.status).toBe(200);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : ${feature}/The last row/${dbBrand} : `, obj);

        expect(
            obj.data.length === 1
            || obj.message === "No row in the store!"
        ).toBe(true);
    });
});


/**
 * @Fetch the some row & some column + limit(1)
 */

tester(`> Test ${dbBrand}/Store/${feature} + the some row + some column + limit`, () => {
    it("should return data(array) & status code is 200 or 404", async () => {
        const bodyData = {
            db_type: dbBrand,
            field_list: ["test_id", "number_field"],
            store_code: "testing_table",
            where: {
                number_field: [1, 2]
            },
            limit: 5,
        };

        const response: any = await request(server).post(TestStoreRoute[feature])
            .set('x_z_token', `${process.env.TESTING_TOKEN}`)
            .send(bodyData);

        // console.log(`# [RESULT] : ${feature}/The some row/${dbBrand} : `, response);
        expect(
            response.status === 200
            || response.status === 404
        ).toBe(true);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : ${feature}/The some row/${dbBrand} : `, obj);

        expect(
            obj.message === "Data's not found!"
            || obj?.data.length >= 1
        ).toBe(true);
    });
});