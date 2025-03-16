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

beforeAll(async () => {
    if (server) {
        await server.close();
    } else {
        await server.connect();
    }
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
    it("should return data(array) & status code is 200", async () => {
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
        expect(response.status).toBe(200);

        const obj: FetchSuccessDataResponseHttp = await response.body;
        console.log(`# [OBJECT] : ${feature}/Some Row/${dbBrand} : `, obj);

        expect(
            obj.data.length === 1
            || obj.message === "No row in the store!"
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